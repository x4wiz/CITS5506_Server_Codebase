// This is charts options and functions for pulling the charts data and update the charts

// Initially graph data is empty
let graph_data = {
    categories: ['sd','sd','sd','sd','sd','sd','sd','sd','sd','sd','sd','sd',],
    co2: [],
    temp: [],
    humid: [],
    tvoc: [],
    labels: [],
    dust: [],
    timestamps: []
}

// Options for CO2 chart
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
    labels: graph_data.timestamps,
    series: [
        {
            name: 'CO2',
            data: graph_data.co2
        },
    ],
    xaxis: {
        categories: graph_data.timestamps,
        labels: {
            show: false
        }
    },
    yaxis: {
        min: 380,
        max: 2000
    }
}

// Options for the temp / humid / tVOC chart
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
    },
    yaxis: {
        min: 0,
        max: 150
    }
}

// Options for the dust chart
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
        categories: graph_data.timestamps,
        labels: {
            show: false
        }
    },
    yaxis: {
        min: 0,
        max: 0.45
    }
}

// Getting data for charts, last num_readings
const get_chart_data = async (num_readings) => {
    await fetch(`${base_path}/get_chart_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            num_readings: num_readings,
            device_id: device_id
        })
    })
        .then(res => res.json())
        .then(data => {
            // the data should be restructured to be supplied to Apexcharts library for updating the charts
            // Restructuring the data and saving it to the graph_data object
            graph_data.co2 = prepare_data(data.co2, data.timestamps)
            graph_data.humid = prepare_data(data.humid, data.timestamps)
            graph_data.temp = prepare_data(data.temp, data.timestamps)
            graph_data.tvoc = prepare_data(data.tvoc, data.timestamps)
            graph_data.dust = prepare_data(data.dust, data.timestamps)
            graph_data.timestamps = data.timestamps
        })
}

// Structuring data into an array of objects
const prepare_data = (values, timestamps) => {
    let new_data = []
    for (let i = 0; i < values.length; i++) {
        new_data.push({x: timestamps[i], y: values[i]})
    }
    return new_data
}

// Redrawing the charts. First, receive data from the backend and the feed it to the updateSeries function of the
// charts instances
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