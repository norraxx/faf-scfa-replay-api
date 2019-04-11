from flask import render_template, request, flash, jsonify
from replay_parser.replay import parse

from source.utils import get_scfa_replay_by_data
from .app import api_app


def process_file():
    if request.files and 'replay' not in request.files:
        flash('FAF Replay or SCFA Replay is missing')

    if request.files:
        replay_file = request.files['replay']
        if replay_file.filename == '':
            flash('No selected file')

        replay_data = get_scfa_replay_by_data(replay_file.read())
        return parse(replay_data, store_body=True)
    return {}


@api_app.route("/", strict_slashes=False, methods=["GET", "POST"])
def index():
    return render_template("index.html")


@api_app.route("/parse", strict_slashes=False, methods=["GET", "POST"])
def parse_api():
    return jsonify(process_file())
