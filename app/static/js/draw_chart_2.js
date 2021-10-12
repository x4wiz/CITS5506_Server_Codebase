let graph_data = {
    categories: [],
    co2: [],
    heat: [],
    temp: [],
    humid: [],
    dust: [],
    labels: []
}

let options1 = {
    chart: {
        type: 'line'
    },
    stroke: {
        curve: 'smooth',
    },
    dataLabels: {
        enabled: false
    },
    labels: graph_data.labels,
    series: [
        {
            name: 'dust',
            data: graph_data.dust
        },
    ],
    xaxis: {
        categories: graph_data.categories,
        labels: {
            show: false
        }
    },
    // yaxis: {
    //     min: 380,
    //     max: 2000
    // }
}
let options2 = {
    chart: {
        type: 'line'
    },
    stroke: {
        curve: 'smooth',
    },
    series: [
        {
            name: 'Humidity',
            data: graph_data.humid
        },
        {
            name: 'Temp',
            data: graph_data.temp
        },
        {
            name: 'heat',
            data: graph_data.heat
        },

    ],
    xaxis: {
        categories: graph_data.categories,
        labels: {
            show: false
        }
    }
}


let options3 = {
    chart: {
        type: 'line'
    },
    stroke: {
        curve: 'smooth',
    },
    annotations: {
        yaxis: [
            {
                y: 1000,
                borderColor: '#00E396',
                label: {
                    borderColor: '#00E396',
                    style: {
                        color: '#fff',
                        background: '#00E396'
                    },
                    text: 'Good level of CO2'
                }
            }
        ]
    },
    dataLabels: {
        enabled: false
    },
    labels: graph_data.labels,
    series: [
        {
            name: 'CO2',
            data: graph_data.co2
        },
    ],
    xaxis: {
        categories: graph_data.categories,
        labels: {
            show: false
        }
    },
    yaxis: {
        min: 380,
        max: 2000
    }
}

const get_chart_data = async (num_readings) => {
    await fetch(`${base_path}/get_chart_data_2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: num_readings
    })
        .then(res => res.json())
        .then(res => {
            graph_data = prepare_data(res)
        })
}

const prepare_data = (data) => {
    let categories = []
    let temp = []
    let co2 = []
    let humid = []
    let heat = []
    let dust = []
    let labels = []

    data.map((line, i) => {
        labels.push(i + 1)
        categories.push(i + 1)
        heat.push({
            x: i+1,
            y: line.split(" ")[2]
        })
        co2.push({
            x: i+1,
            y: line.split(" ")[4]
        })
        temp.push({
            x: i+1,
            y: line.split(" ")[0]
        })
        humid.push({
            x: i+1,
            y: line.split(" ")[1]
        })
        dust.push({
            x: i+1,
            y: line.split(" ")[3]
        })
    })
    return {categories, co2, heat, temp, humid, dust, labels}
}

const redraw_chart = () => {
    get_chart_data(num_readings).then(() => {
        chart1.updateSeries([
            {
                data: graph_data.dust
            }
        ])
        chart2.updateSeries([
            {
                data: graph_data.humid
            },
            {
                data: graph_data.temp
            },
            {
                data: graph_data.heat
            }
        ])
        chart3.updateSeries([
            {
                data: graph_data.co2
            }
        ])
    })
}




