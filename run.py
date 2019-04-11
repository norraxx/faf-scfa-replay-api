#!/usr/bin/env python3.6

from os import environ

from source import views
from source.app import api_app

views = views  # don't remove this line

if __name__ == '__main__':
    api_app.run(
        debug=True,
        host="0.0.0.0",
        port=environ.get("REPLAY_API_PORT", 13666),
    )
