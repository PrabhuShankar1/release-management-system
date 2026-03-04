from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Project, Release, Task
from sqlalchemy.orm import joinedload

routes = Blueprint("routes", __name__)


# ======================================================
# TEST
# ======================================================

@routes.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "API working"}), 200


# ======================================================
# AUTH
# ======================================================

@routes.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), 400

    existing = User.query.filter_by(email=data.get("email")).first()
    if existing:
        return jsonify({"message": "Email already registered"}), 400

    user = User(
        name=data.get("name"),
        email=data.get("email"),
        role=data.get("role")
    )

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
        "role": user.role   # ⭐ MUST RETURN
    }
}), 200


# ======================================================
# PROJECTS
# ======================================================

@routes.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json()

    project = Project(
        name=data.get("name"),
        description=data.get("description", "")
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project created"}), 201


@routes.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description
        }
        for p in projects
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


# ======================================================
# RELEASES
# ======================================================

@routes.route("/api/releases", methods=["POST"])
def create_release():
    data = request.get_json()

    release = Release(
        name=data.get("name"),
        version=data.get("version"),
        status=data.get("status", "Pending"),
        project_id=data.get("project_id")
    )

    db.session.add(release)
    db.session.commit()

    return jsonify({"message": "Release created"}), 201


@routes.route("/api/releases", methods=["GET"])
def get_releases():

    # 🔥 joinedload prevents extra DB queries (performance boost)
    releases = Release.query.options(joinedload(Release.project)).all()

    result = []

    for r in releases:
        result.append({
            "id": r.id,
            "name": r.name,
            "version": r.version,
            "status": r.status,
            "project_id": r.project_id,

            # ✅ SAFE (NO crash)
            "project_name": r.project.name if r.project else None
        })

    return jsonify(result), 200


@routes.route("/api/releases/<int:id>", methods=["PUT"])
def update_release(id):
    data = request.get_json()
    release = Release.query.get_or_404(id)

    release.name = data.get("name", release.name)
    release.version = data.get("version", release.version)
    release.status = data.get("status", release.status)
    release.project_id = data.get("project_id", release.project_id)

    db.session.commit()

    return jsonify({"message": "Release updated"}), 200


@routes.route("/api/releases/<int:id>", methods=["DELETE"])
def delete_release(id):
    release = Release.query.get_or_404(id)

    db.session.delete(release)
    db.session.commit()

    return jsonify({"message": "Release deleted"}), 200


# ======================================================
# TASKS
# ======================================================

@routes.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    task = Task(
        title=data.get("title"),
        status=data.get("status", "Open"),
        release_id=data.get("release_id"),
        assigned_to=data.get("assigned_to")
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created"}), 201


@routes.route("/api/tasks", methods=["GET"])
def get_tasks():
    release_id = request.args.get("release_id")

    query = Task.query

    if release_id:
        query = query.filter_by(release_id=release_id)

    tasks = query.all()

    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "release_id": t.release_id
        }
        for t in tasks
    ]), 200


@routes.route("/api/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.get_json()
    task = Task.query.get_or_404(id)

    task.title = data.get("title", task.title)
    task.status = data.get("status", task.status)
    task.assigned_to = data.get("assigned_to", task.assigned_to)

    db.session.commit()

    return jsonify({"message": "Task updated"}), 200


@routes.route("/api/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get_or_404(id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"}), 200

