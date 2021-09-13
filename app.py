from flask import Flask, request, render_template, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return render_template('main.html', title='Home')


# Move to next lesson call
@app.route('/api/v1/get_data', methods=["POST", "GET"])
def finish_lesson():
    response = request.get_json()
    print(response)
    with open('static/readings.txt', 'a') as file:
        file.write("\n")
        file.write(response["data"])
    return response


@app.route('/api/v1/get_readings', methods=["POST", "GET"])
def get_readings():
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()
    response = jsonify(readings[-1])
    # response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# Adding headers to the response
@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    return response


if __name__ == '__main__':
    app.run()
