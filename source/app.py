import os

from flask import Flask

from source.utils import ByteLessJSONEncoder

__all__ = ("api_app",)

api_app = Flask(
    "replay-api",
    template_folder=os.path.abspath(os.path.join(os.path.realpath(__file__), "..", "..", "templates")),
    static_folder=os.path.abspath(os.path.join(os.path.realpath(__file__), "..", "..", "static")),
)
api_app.config['UPLOAD_FOLDER'] = os.path.abspath(os.path.join(os.path.realpath(__file__), "..", "..", "upload")),
api_app.secret_key = "youdontknowhowmuchidon'tlikethat?^^&$#)(@SJF:S"
api_app.json_encoder = ByteLessJSONEncoder
