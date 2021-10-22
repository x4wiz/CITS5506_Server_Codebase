import json

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
