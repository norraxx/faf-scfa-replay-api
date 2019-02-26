from flask import render_template, request, flash
from replay_parser.replay import parse

from source.utils import get_scfa_replay_by_data
from .app import api_app


@api_app.route("/", strict_slashes=False, methods=["GET", "POST"])
def index():
    data = process_file()
    return render_template("index.html", data=data)


def process_file():

    if 'replay' not in request.files:
        flash('FAF Replay or SCFA Replay is missing')

    if request.files:
        replay_file = request.files['replay']
        if replay_file.filename == '':
            flash('No selected file')

        replay_data = get_scfa_replay_by_data(replay_file.read())
        return parse(replay_data, store_body=True)
    return {}
