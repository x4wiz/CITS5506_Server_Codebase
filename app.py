from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


# Move to next lesson call
@app.route('/api/v1/get_data', methods=["POST", "GET"])
def finish_lesson():
    response = request.get_json()
    print(response)
    return jsonify(response)


if __name__ == '__main__':
    app.run()
