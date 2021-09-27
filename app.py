import json
from flask import Flask, request, render_template, jsonify

from functions.helpers import analise_co2_over1000, moving_average

# from flask_assets import Bundle, Environment

app = Flask(__name__)


# Bundling src/main.css files into dist/main.css'
# css = Bundle('src/main.css', output='dist/main.css',
#              filters='postcss')
#
# assets = Environment(app)
# assets.register('main_css', css)
# css.build()


@app.route('/p1')
def prototype_1():
    return render_template('prototype_1.html', title='Prototype 1')


@app.route('/p2')
def prototype_2():
    return render_template('prototype_2.html', title='Prototype 2')


@app.route('/api/v1/receive_data', methods=["POST"])
def receive_data():
    response = request.get_json()
    print(response)
    with open('static/readings.txt', 'a') as file:
        file.write("\n")
        file.write(response["data"])

    if analise_co2_over1000():
        with open('static/settings.json', 'r+') as file:
            data = json.load(file)
            data["alarm"] = True
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()
    else:
        with open('static/settings.json', 'r+') as file:
            data = json.load(file)
            data["alarm"] = False
            data["stop_alarm"] = False
            file.seek(0)
            json.dump(data, file, indent=4)
            file.truncate()
    return response


@app.route('/api/v1/receive_data_c', methods=["POST"])
def receive_data_c():
    response = request.get_json()
    print(response)
    with open('static/readings_c.txt', 'a') as file:
        file.write("\n")
        file.write(response["data"])
    return response


@app.route('/api/v1/get_readings', methods=["POST", "GET"])
def get_readings():
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()
    response = jsonify(readings[-1])

    return response


@app.route('/api/v1/get_readings_2', methods=["POST", "GET"])
def get_readings_2():
    with open('static/readings_c.txt', 'r') as file:
        readings = file.readlines()

    response = jsonify(readings[-1])

    return response


@app.route('/api/v1/get_chart_data', methods=["POST", "GET"])
def get_chart_data():
    num_readings = request.get_json()
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()
    response = jsonify(readings[-1 * num_readings:])
    return response


@app.route('/api/v1/get_chart_data_2', methods=["POST", "GET"])
def get_chart_data_2():
    num_readings = request.get_json()
    with open('static/readings_c.txt', 'r') as file:
        readings = file.readlines()
        n = 50
        data = moving_average(readings[-n:])
        print(data)

    response = jsonify(readings[-1 * num_readings:])
    return response


@app.route('/api/v1/get_settings', methods=["POST", "GET"])
def get_settings():
    with open('static/settings.json') as file:
        data = json.load(file)
        response = data
    return response


@app.route('/api/v1/set_readings_interval', methods=["POST", "GET"])
def set_readings_interval():
    response = request.get_json()
    print(response)
    with open('static/settings.json', 'r+') as file:
        data = json.load(file)
        data["interval"] = int(response["interval"])
        file.seek(0)
        json.dump(data, file, indent=4)
        file.truncate()
    return response


@app.route('/api/v1/stop_alarm', methods=["POST", "GET"])
def stop_alarm():
    response = request.get_json()
    print(response)
    with open('static/settings.json', 'r+') as file:
        data = json.load(file)
        data["stop_alarm"] = True
        print(data)
        file.seek(0)
        json.dump(data, file, indent=4)
        file.truncate()
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
