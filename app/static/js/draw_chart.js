let graph_data = {
    categories: [],
    co2: [],
    temp: [],
    humid: [],
    tvoc: [],
    labels: [],
    dust: []
}

let options1 = {
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
            name: 'Temperature',
            data: graph_data.temp
        },
        {
            name: 'tVOC',
            data: graph_data.tvoc
        },

    ],
    legend: {
        show: true
    },
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
                y: 0.15,
                borderColor: '#00E396',
                label: {
                    borderColor: '#00E396',
                    style: {
                        color: '#fff',
                        background: '#00E396'
                    },
                    text: 'Good level of dust'
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
            name: 'Dust',
            data: graph_data.dust
        },
    ],
    xaxis: {
        categories: graph_data.categories,
        labels: {
            show: false
        }
    },
    yaxis: {
        min: 0,
        max: 0.45
    }
}

const get_chart_data = async (num_readings) => {
    await fetch(`${base_path}/get_chart_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: num_readings
    })
        .then(res => res.json())
        .then(data => {
            graph_data.co2 = data.co2
            graph_data.humid = data.humid
            graph_data.temp = data.temp
            graph_data.tvoc = data.tvoc
            graph_data.dust = data.dust
        })
}

const redraw_chart = () => {
    get_chart_data(num_readings).then(() => {
        chart1.updateSeries([
            {
                data: graph_data.co2
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
                data: graph_data.tvoc
            }
        ])
        chart3.updateSeries([
            {
                data: graph_data.dust
            }
        ])
    })

}




