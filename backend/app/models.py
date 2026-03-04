from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


# ======================================================
# USER
# ======================================================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"<User {self.email}>"


# ======================================================
# PROJECT
# ======================================================
class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)

    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # ⭐ relationship
    releases = db.relationship(
        "Release",
        backref="project",
        cascade="all, delete",
        lazy=True
    )

    def __repr__(self):
        return f"<Project {self.name}>"


# ======================================================
# RELEASE
# ======================================================
class Release(db.Model):
    __tablename__ = "releases"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="Pending")

    # ⭐ MUST NOT BE NULL (prevents Unknown)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )

    tasks = db.relationship(
        "Task",
        backref="release",
        cascade="all, delete",
        lazy=True
    )

    def __repr__(self):
        return f"<Release {self.name} {self.version}>"


# ======================================================
# TASK
# ======================================================
class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="Open")

    assigned_to = db.Column(db.Integer, db.ForeignKey("users.id"))

    release_id = db.Column(
        db.Integer,
        db.ForeignKey("releases.id"),
        nullable=False
    )

    def __repr__(self):
        return f"<Task {self.title}>"