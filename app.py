from flask import Flask, request, jsonify, render_template

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

    return readings[-1]


if __name__ == '__main__':
    app.run()
