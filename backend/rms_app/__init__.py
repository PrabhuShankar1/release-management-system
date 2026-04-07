import os

from flask import Flask
from flask_cors import CORS
from sqlalchemy import inspect, text

from .extensions import db
from .routes import routes


def get_database_uri(app: Flask):
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        if database_url.startswith("postgres://"):
            return database_url.replace("postgres://", "postgresql://", 1)
        return database_url

    if os.getenv("VERCEL"):
        # Vercel functions can write only to temporary storage.
        return "sqlite:////tmp/rms.db"

    os.makedirs(app.instance_path, exist_ok=True)
    return f"sqlite:///{os.path.join(app.instance_path, 'rms.db')}"


def ensure_release_columns():
    inspector = inspect(db.engine)
    existing_columns = {column["name"] for column in inspector.get_columns("releases")}

    column_definitions = {
        "requested_by": "INTEGER",
        "requested_at": "DATETIME",
        "approved_by": "INTEGER",
        "approved_at": "DATETIME",
    }

    for column_name, column_type in column_definitions.items():
        if column_name not in existing_columns:
            db.session.execute(text(f"ALTER TABLE releases ADD COLUMN {column_name} {column_type}"))

    if "status" in existing_columns:
        db.session.execute(
            text(
                "UPDATE releases SET status = 'Pending Approval' "
                "WHERE status IS NULL OR status = '' OR status = 'Pending'"
            )
        )


def ensure_task_columns():
    inspector = inspect(db.engine)
    existing_columns = {column["name"] for column in inspector.get_columns("tasks")}

    column_definitions = {
        "product": "VARCHAR(200)",
        "quantity": "INTEGER",
        "reason": "TEXT",
        "requested_by": "INTEGER",
        "requested_at": "DATETIME",
        "manager_comment": "TEXT",
        "reviewed_at": "DATETIME",
    }

    for column_name, column_type in column_definitions.items():
        if column_name not in existing_columns:
            db.session.execute(text(f"ALTER TABLE tasks ADD COLUMN {column_name} {column_type}"))

    if "status" in existing_columns:
        db.session.execute(
            text(
                "UPDATE tasks SET status = 'Pending' "
                "WHERE status IS NULL OR status = '' OR status = 'Open' OR status = 'In Progress'"
            )
        )

    if "quantity" in {column["name"] for column in inspect(db.engine).get_columns("tasks")}:
        db.session.execute(text("UPDATE tasks SET quantity = 1 WHERE quantity IS NULL"))


def ensure_default_admin():
    from .models import User

    if User.query.first():
        return

    admin = User(
        name=os.getenv("DEFAULT_ADMIN_NAME", "Admin"),
        email=os.getenv("DEFAULT_ADMIN_EMAIL", "admin@rms.local"),
        role=os.getenv("DEFAULT_ADMIN_ROLE", "Admin"),
    )
    admin.set_password(os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123"))
    db.session.add(admin)


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri(app)
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    with app.app_context():
        try:
            db.create_all()
            ensure_release_columns()
            ensure_task_columns()
            ensure_default_admin()
            db.session.commit()
        except Exception:
            db.session.rollback()
            app.logger.exception("Database initialization failed during app startup.")

    app.register_blueprint(routes)

    return app


app = create_app()
