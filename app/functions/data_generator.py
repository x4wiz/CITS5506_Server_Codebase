import requests
from random import randint
from time import sleep

base_url = 'http://127.0.0.1:5000/api/v1/'

while True:
    temp = str(randint(23, 24))
    humid = str(randint(50, 54))
    heat = str(randint(23, 24))
    dust = str(randint(9, 12) / 100)
    co2 = str(randint(500, 550))
    tvoc = str(randint(5, 15))
    device_id = '24ac4f6a4c'

    data = temp + " " + humid + " " + heat + " " + dust + " " + co2 + " " + \
           tvoc + " " + device_id
    print(data)
    try:
        res = requests.post(
            f'{base_url}receive_data',
            json={'data': data})
    except:
        print("Something went wrong")

    sleep(3)
