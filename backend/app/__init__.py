from flask import Flask
from flask_cors import CORS
from .extensions import db
from .routes import routes

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///rms.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    CORS(app)  # ⭐ allow frontend requests

    app.register_blueprint(routes)

    return app
