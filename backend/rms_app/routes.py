from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload

from rms_app.extensions import db
from rms_app.models import Project, Release, Task, User

routes = Blueprint("routes", __name__)


def get_request_release():
    project = Project.query.filter_by(name="Internal Requests").first()
    if not project:
        project = Project(name="Internal Requests", description="System-managed project for worker task requests.")
        db.session.add(project)
        db.session.flush()

    release = Release.query.filter_by(project_id=project.id, name="Task Requests", version="1.0").first()
    if not release:
        release = Release(
            name="Task Requests",
            version="1.0",
            status="Approved",
            project_id=project.id
        )
        db.session.add(release)
        db.session.flush()

    return release


def serialize_release(release: Release):
    return {
        "id": release.id,
        "name": release.name,
        "version": release.version,
        "status": release.status,
        "project_id": release.project_id,
        "project_name": release.project.name if release.project else None,
        "requested_by": release.requested_by,
        "requested_by_name": release.requester.name if release.requester else None,
        "requested_at": release.requested_at.isoformat() if release.requested_at else None,
        "approved_by": release.approved_by,
        "approved_by_name": release.approver.name if release.approver else None,
        "approved_at": release.approved_at.isoformat() if release.approved_at else None,
    }


def serialize_task(task: Task):
    return {
        "id": task.id,
        "title": task.title,
        "product": task.product,
        "quantity": task.quantity,
        "reason": task.reason,
        "status": task.status,
        "release_id": task.release_id,
        "requested_by": task.requested_by,
        "requested_by_name": task.requester.name if task.requester else None,
        "requested_at": task.requested_at.isoformat() if task.requested_at else None,
        "manager_comment": task.manager_comment,
        "reviewed_at": task.reviewed_at.isoformat() if task.reviewed_at else None,
    }


@routes.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "API working"}), 200


@routes.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), 400

    existing = User.query.filter_by(email=data.get("email")).first()
    if existing:
        return jsonify({"message": "Email already registered"}), 400

    user = User(name=data.get("name"), email=data.get("email"), role=data.get("role"))
    user.set_password(data.get("password"))

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@routes.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.check_password(data.get("password")):
        return jsonify({"message": "Wrong password"}), 401

    return jsonify({
        "message": "Login success",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200


@routes.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.order_by(User.role.asc(), User.name.asc()).all()
    return jsonify([
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "title": f"{user.role} Member"
        }
        for user in users
    ]), 200


@routes.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


@routes.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json()
    project = Project(name=data.get("name"), description=data.get("description", ""))
    db.session.add(project)
    db.session.commit()
    return jsonify({"message": "Project created"}), 201


@routes.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    return jsonify([
        {"id": project.id, "name": project.name, "description": project.description}
        for project in projects
    ]), 200


@routes.route("/api/projects/<int:id>", methods=["PUT"])
def update_project(id):
    data = request.get_json()
    project = Project.query.get_or_404(id)
    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)
    db.session.commit()
    return jsonify({"message": "Project updated"}), 200


@routes.route("/api/projects/<int:id>", methods=["DELETE"])
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted"}), 200


@routes.route("/api/releases", methods=["POST"])
def create_release():
    data = request.get_json() or {}
    user_role = data.get("user_role")

    release = Release(
        name=data.get("name"),
        version=data.get("version"),
        status="Approved" if user_role == "Manager" else "Pending Approval",
        project_id=data.get("project_id"),
        requested_by=data.get("user_id")
    )

    if user_role == "Manager":
        release.approved_by = data.get("user_id")
        release.approved_at = datetime.utcnow()

    db.session.add(release)
    db.session.commit()

    message = "Release approved and created" if user_role == "Manager" else "Release request submitted"
    return jsonify({"message": message, "release": serialize_release(release)}), 201


@routes.route("/api/releases", methods=["GET"])
def get_releases():
    releases = Release.query.options(
        joinedload(Release.project),
        joinedload(Release.requester),
        joinedload(Release.approver)
    ).all()
    return jsonify([serialize_release(release) for release in releases]), 200


@routes.route("/api/releases/<int:id>", methods=["PUT"])
def update_release(id):
    data = request.get_json() or {}
    release = Release.query.get_or_404(id)
    user_role = data.get("user_role")

    if data.get("action") == "approve":
        if user_role != "Manager":
            return jsonify({"message": "Only managers can approve release requests"}), 403

        release.status = "Approved"
        release.approved_by = data.get("user_id")
        release.approved_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Release request approved", "release": serialize_release(release)}), 200

    if release.status == "Approved":
        return jsonify({"message": "Approved releases cannot be edited"}), 400

    release.name = data.get("name", release.name)
    release.version = data.get("version", release.version)
    release.project_id = data.get("project_id", release.project_id)
    db.session.commit()

    return jsonify({"message": "Release request updated", "release": serialize_release(release)}), 200


@routes.route("/api/releases/<int:id>", methods=["DELETE"])
def delete_release(id):
    release = Release.query.get_or_404(id)
    db.session.delete(release)
    db.session.commit()
    return jsonify({"message": "Release deleted"}), 200


@routes.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json() or {}
    request_release = get_request_release()

    task = Task(
        title=data.get("product") or "Task Request",
        product=data.get("product"),
        quantity=data.get("quantity", 1),
        reason=data.get("reason"),
        status=data.get("status", "Pending"),
        release_id=request_release.id,
        assigned_to=data.get("assigned_to"),
        requested_by=data.get("user_id")
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task request created", "task": serialize_task(task)}), 201


@routes.route("/api/tasks", methods=["GET"])
def get_tasks():
    release_id = request.args.get("release_id")
    user_id = request.args.get("user_id", type=int)
    user_role = request.args.get("user_role")
    status = request.args.get("status")

    query = Task.query.options(joinedload(Task.requester))

    if release_id:
        query = query.filter_by(release_id=release_id)

    if user_role == "Worker" and user_id:
        query = query.filter_by(requested_by=user_id)

    if status:
        query = query.filter_by(status=status)

    tasks = query.order_by(Task.requested_at.desc(), Task.id.desc()).all()
    return jsonify([serialize_task(task) for task in tasks]), 200


@routes.route("/api/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.get_json() or {}
    task = Task.query.get_or_404(id)

    if data.get("action") == "approve":
        task.status = "Approved"
        task.manager_comment = None
        task.reviewed_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Task request approved", "task": serialize_task(task)}), 200

    if data.get("action") == "reject":
        comment = (data.get("manager_comment") or "").strip()
        if not comment:
            return jsonify({"message": "Manager comment is required when rejecting a request"}), 400

        task.status = "Rejected"
        task.manager_comment = comment
        task.reviewed_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Task request rejected", "task": serialize_task(task)}), 200

    task.product = data.get("product", task.product)
    task.quantity = data.get("quantity", task.quantity)
    task.reason = data.get("reason", task.reason)
    task.title = task.product or task.title
    task.status = data.get("status", task.status)
    task.assigned_to = data.get("assigned_to", task.assigned_to)

    db.session.commit()

    return jsonify({"message": "Task updated", "task": serialize_task(task)}), 200


@routes.route("/api/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200
