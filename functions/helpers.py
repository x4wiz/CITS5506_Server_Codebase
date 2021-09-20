def analise_co2_spike():
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()

    sum = 0
    for line in readings[-5:]:
        sum += int(line.split(" ")[7])

    avg = (sum / 5)
    last_read = int(readings[-6].split(" ")[7]) * 1.3
    print(f"Avg: {avg} 6th behind * 1.3: {last_read}")

    if (avg) > last_read * 1.3:
        return True
    return False


def analise_co2_over1000():
    with open('static/readings.txt', 'r') as file:
        readings = file.readlines()
        last_read = int(readings[-1].split(" ")[7])
        print(last_read)
        if last_read > 1000:
            return True
