from flask import Flask, request, render_template, jsonify

from flask_assets import Bundle, Environment

app = Flask(__name__)

# Bundling src/main.css files into dist/main.css'
css = Bundle('src/main.css', output='dist/main.css',
             filters='postcss')

assets = Environment(app)
assets.register('main_css', css)
css.build()


@app.route('/')
def hello_world():  # put application's code here
    return render_template('main.html', title='Home')


# Move to next lesson call
@app.route('/api/v1/receive_data', methods=["POST", "GET"])
def receive_data():
    response = request.get_json()
    with open('static/readings.txt', 'a') as file:
        file.write("\n")
        file.write(response["data"])
    return response


@app.route('/api/v1/get_readings', methods=["POST", "GET"])
def get_readings():
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()
    response = jsonify(readings[-1])

    return response


@app.route('/api/v1/get_readings_interval', methods=["POST", "GET"])
def get_readings_interval():
    with open('static/settings.txt', 'r') as file:
        response = file.readlines()[-1]
        # response = jsonify(readings)
        print(response)
    return response


@app.route('/api/v1/set_readings_interval', methods=["POST", "GET"])
def set_readings_interval():
    response = request.get_json()
    print(response)
    with open('static/settings.txt', 'w') as file:
        file.write(response["interval"])
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
