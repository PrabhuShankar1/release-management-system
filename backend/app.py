
from flask import Flask
from app.extensions import db, login_manager
from app.routes import routes
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///rms.db"
app.config["SECRET_KEY"] = "secret"

db.init_app(app)
login_manager.init_app(app)

from app.routes import routes
app.register_blueprint(routes)

@app.route("/")
def home():
    return "RMS Backend Running"

if __name__ == "__main__":
    app.run(debug=True)
