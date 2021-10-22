import json
from datetime import datetime, timezone
import pytz
from flask import request, render_template, jsonify, flash, redirect, \
    url_for
from flask_login import current_user, login_user, logout_user, login_required, \
    login_manager
from werkzeug.urls import url_parse
from app import app
from app import db
from app.forms import LoginForm
from app.forms import RegistrationForm
from app.functions.helpers import check_co2_threshold, check_dust_threshold, moving_average
from app.models import User, Data, Device


### ROUTES FOR PAGES ###

# LOGIN PAGE
@app.route('/', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('prototype_2'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        print(user)
        print(user.check_password(form.password.data))
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('prototype_1')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


# LOGOUT FUNCTION
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))


# REGISTRATION PAGE
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

# PROTOTYPE 1 PAGE
@app.route('/p1')
@login_required
def prototype_1():
    return render_template('prototype_1.html', title='Prototype 1', device_id=1)


# PROTOTYPE 2 PAGE
@app.route('/p2')
@login_required
def prototype_2():
    return render_template('prototype_2.html', title='Prototype 2', device_id=2)


# ----------------------------------#
# ---         API ROUTES        ----#
# ----------------------------------#

# --- receive data from device --- #
@app.route('/api/v1/receive_data', methods=["POST"])
def receive_data():
    response = request.get_json()
    device_sn = response["data"].split(" ")[6]
    device_id = Device.query.filter_by(serial_num=device_sn).first().id
    temp = float(response["data"].split(" ")[0])
    humid = float(response["data"].split(" ")[1])
    heat = float(response["data"].split(" ")[2])
    dust = float(response["data"].split(" ")[3])
    co2 = int(response["data"].split(" ")[4])
    tvoc = int(response["data"].split(" ")[5])

    data = Data(temp=temp, humid=humid, heat=heat,
                dust=dust, co2=co2, tvoc=tvoc, device_id=device_id)
    db.session.add(data)
    db.session.commit()

    # turning alarm on and off for the first device
    # current alarm state is stored in the settings.json file
    if device_id == 2:
        return response
    else:
        if check_co2_threshold(co2):
            with open('app/static/settings.json', 'r+') as file:
                data = json.load(file)
                data["alarm"] = True
                data["co2_color"] = 'red'
                file.seek(0)
                json.dump(data, file, indent=4)
                file.truncate()
        else:
            with open('app/static/settings.json', 'r+') as file:
                data = json.load(file)
                if data["dust_color"] == "green":
                    data["alarm"] = False
                    data["stop_alarm"] = False
                    data["co2_color"] = 'green'
                else:
                    data["co2_color"] = 'green'
                file.seek(0)
                json.dump(data, file, indent=4)
                file.truncate()

        if check_dust_threshold(dust):
            with open('app/static/settings.json', 'r+') as file:
                data = json.load(file)
                data["alarm"] = True
                data["dust_color"] = 'red'
                file.seek(0)
                json.dump(data, file, indent=4)
                file.truncate()
        else:
            with open('app/static/settings.json', 'r+') as file:
                data = json.load(file)
                if data["co2_color"] == "green":
                    data["alarm"] = False
                    data["stop_alarm"] = False
                    data["dust_color"] = 'green'
                else:
                    data["dust_color"] = 'green'
                file.seek(0)
                json.dump(data, file, indent=4)
                file.truncate()
        return response


# --- Get latest readings  --- #
@app.route('/api/v1/get_readings', methods=["POST", "GET"])
def get_readings():
    req = request.get_json()
    response = Data.query.filter_by(device_id=req["device"]).order_by(Data.id.desc()).first().as_dict()
    print(response)
    db_datetime = response["timestamp"].split(".")[0]
    d = datetime.strptime(db_datetime, "%Y-%m-%d %H:%M:%S")
    d = d.replace(tzinfo=timezone.utc)
    west = pytz.timezone('Australia/West')
    d = d.astimezone(west)
    response["timestamp"] = d.strftime("%Y-%m-%d %H:%M:%S")
    return response


# --- Get last n rows of data for charts --- #
@app.route('/api/v1/get_chart_data', methods=["POST", "GET"])
def get_chart_data():

    req = request.get_json()
    num_readings = req["num_readings"]
    device_id = req["device_id"]

    # serializing data from db
    data = Data.query.filter_by(device_id=device_id).order_by(Data.id.desc()).limit(num_readings)
    temp = [r.temp for r in data][::-1]
    humid = [r.humid for r in data][::-1]
    heat = [r.heat for r in data][::-1]
    dust = [r.dust for r in data][::-1]
    co2 = [r.co2 for r in data][::-1]
    tvoc = [r.tvoc for r in data][::-1]

    # serializing timestamp and bringing time from UCF to local
    timestamps = [r.timestamp for r in data][::-1]
    fixed_timestamps = []
    west = pytz.timezone('Australia/West')
    for timestamp in timestamps:
        d = timestamp.replace(tzinfo=timezone.utc)
        d = d.astimezone(west)
        # fixed_timestamps.append(d.strftime("%Y-%m-%d %H:%M:%S"))
        fixed_timestamps.append(d.strftime("%H:%M:%S"))

    # preparing response
    response = {'temp': temp, 'humid': humid, 'heat': heat, 'dust': dust,
                'co2': co2, 'tvoc': tvoc, 'timestamps': fixed_timestamps}
    response = jsonify(response)
    return response


# --- Get current settings --- #
@app.route('/api/v1/get_settings', methods=["POST", "GET"])
def get_settings():
    with open('app/static/settings.json') as file:
        data = json.load(file)
        response = data
    return response


# --- Set readings interval --- #
@app.route('/api/v1/set_readings_interval', methods=["POST", "GET"])
def set_readings_interval():
    response = request.get_json()
    with open('app/static/settings.json', 'r+') as file:
        data = json.load(file)
        data["interval"] = int(response["interval"])
        file.seek(0)
        json.dump(data, file, indent=4)
        file.truncate()
    return response


# --- Set CO2 and dust thresholds ---- #
@app.route('/api/v1/set_threshold', methods=["POST", "GET"])
def set_threshold():
    response = request.get_json()
    with open('app/static/settings.json', 'r+') as file:
        data = json.load(file)
        if response["sensor"] == "co2":
            data["co2_threshold"] = int(response["threshold"])
        else:
            data["dust_threshold"] = response["threshold"]
        file.seek(0)
        json.dump(data, file, indent=4)
        file.truncate()
    return response


# --- Stop alarm on the device and website --- #
@app.route('/api/v1/stop_alarm', methods=["POST", "GET"])
def stop_alarm():
    response = request.get_json()
    with open('app/static/settings.json', 'r+') as file:
        data = json.load(file)
        data["stop_alarm"] = True
        data["alarm"] = False
        file.seek(0)
        json.dump(data, file, indent=4)
        file.truncate()
    return response


# Adding headers to the response to get over CORS policy
@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    return response
