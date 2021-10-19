import numpy as np
import json


def analise_co2_spike():
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()

    sum = 0
    for line in readings[-5:]:
        sum += int(line.split(" ")[7])

    avg = (sum / 5)
    last_read = int(readings[-6].split(" ")[4]) * 1.3
    print(f"Avg: {avg} 6th behind * 1.3: {last_read}")

    if (avg) > last_read * 1.3:
        return True
    return False


def check_co2_threshold(co2):
    print("co2: ", co2)
    with open('app/static/settings.json', 'r+') as file:
        data = json.load(file)
        if co2 > int(data["co2_threshold"]):
            return True
        else:
            return False


def check_dust_threshold(dust):
    with open('app/static/settings.json', 'r+') as file:
        data = json.load(file)
        if float(dust) > float(data["dust_threshold"]):
            return True
        else:
            return False


def moving_average(readings):
    data = []
    for line in readings:
        data.append(float(line.split(" ")[3][:-2]))

    # print(data)
    convolved = np.convolve(data, np.ones(10) / 10, mode='valid')
    # print(convolved)
    return convolved.tolist()
