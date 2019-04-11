import base64
import json
import zlib
from io import StringIO


def get_scfa_replay_by_data(data: bytes):
    """
    FAF and Supreme Commander has 2 kind of formats:
    1. scfareplay - that is simple binary stuff
    2. fafreplay - it's zlib compressed scfareplay data with json header
    """
    try:
        stream = StringIO(data.decode())
        header = stream.readline().strip()

        if json.loads(header):
            body = stream.read().strip()
            return zlib.decompress(base64.b64decode(body)[4:])
    except:
        pass

    return data
