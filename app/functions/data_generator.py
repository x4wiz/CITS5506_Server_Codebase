from random import randint
from time import sleep

import requests

# base_url = 'http://192.168.1.127:5000/api/v1/'
base_url = 'http://127.0.0.1:5000/api/v1/'
# base_url = 'https://smart-air-quality.herokuapp.com/api/v1/'

while True:
    temp = str(randint(23, 24))
    humid = str(randint(50, 54))
    heat = str(randint(23, 24))
    dust = str(randint(9, 12) / 100)
    co2 = str(randint(500, 550))
    tvoc = str(randint(5, 15))

    data = temp + " " + humid + " " + heat + " " + dust + " " + co2 + " " + \
           tvoc
    print(data)
    try:
        res = requests.post(
            f'{base_url}receive_data',
            json={'data': data})
    except:
        print("Something went wrong")

    sleep(10)
