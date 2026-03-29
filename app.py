from flask import Flask, jsonify, render_template, request
import json
import os

app = Flask(__name__)


def load_portfolio_data():
    data = {}
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    if os.path.exists(data_dir):
        for lang_folder in os.listdir(data_dir):
            lang_path = os.path.join(data_dir, lang_folder)
            if os.path.isdir(lang_path):
                data[lang_folder] = {}
                for filename in os.listdir(lang_path):
                    if filename.endswith(".json"):
                        section = filename.split(".")[0]
                        with open(
                            os.path.join(lang_path, filename), "r", encoding="utf-8"
                        ) as f:
                            file_data = json.load(f)
                            if section == "nav":
                                data[lang_folder].update(file_data)
                            else:
                                data[lang_folder][section] = file_data
    return data


PORTFOLIO_DATA = load_portfolio_data()


# ─────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/portfolio/<lang>")
def portfolio(lang):
    if lang not in PORTFOLIO_DATA:
        return jsonify({"error": "Language not supported"}), 404
    return jsonify(PORTFOLIO_DATA[lang])


@app.route("/api/projects/<lang>")
def projects(lang):
    if lang not in PORTFOLIO_DATA:
        return jsonify({"error": "Language not supported"}), 404
    return jsonify(PORTFOLIO_DATA[lang]["projects"]["items"])


if __name__ == "__main__":
    app.run(debug=True, port=5000)
