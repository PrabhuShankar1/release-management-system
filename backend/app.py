from app import app


@app.route("/")
def home():
    return "RMS Backend Running"


if __name__ == "__main__":
    app.run(debug=True)
