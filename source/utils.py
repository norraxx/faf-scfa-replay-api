import base64
import json
import zlib


def get_scfa_replay_by_data(data):
    try:
        header = data.decode().readline()
        if json.loads(header):
            body = data.read().strip()
            return zlib.decompress(base64.b64decode(body)[4:])
    except:
        pass

    return data
