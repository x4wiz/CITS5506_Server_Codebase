from flask import jsonify


def authorize_request(req):
    headers = req.headers
    auth = headers.get("X-Api-Key")
    if auth == 'we-will-never-be-hacked!':
        return True
            # jsonify({"message": "OK: Authorized"}), 200
    else:
        return False
            # jsonify({"message": "ERROR: Unauthorized"}), 401