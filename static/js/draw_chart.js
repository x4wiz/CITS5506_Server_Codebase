let graph_data = {
    categories: [],
    CO2: [],
    temp: [],
    humid: [],
    TVOC: [],
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
            name: 'CO2',
            data: graph_data.CO2
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
            name: 'Temp',
            data: graph_data.temp
        },
        {
            name: 'TVOC',
            data: graph_data.TVOC
        },

    ],
    xaxis: {
        categories: graph_data.categories,
        labels: {
            show: false
        }
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
        .then(res => {
            graph_data = prepare_data(res)
        })
}

const prepare_data = (data) => {
    let categories = []
    let CO2 = []
    let temp = []
    let humid = []
    let TVOC = []
    let labels = []

    data.map((line, i) => {
        labels.push(i + 1)
        categories.push(line.split(" ")[5])
        CO2.push({
            x: line.split(" ")[5],
            y: line.split(" ")[7]
        })
        temp.push({
            x: line.split(" ")[5],
            y: line.split(" ")[0]
        })
        humid.push({
            x: line.split(" ")[5],
            y: line.split(" ")[1]
        })
        TVOC.push({
            x: line.split(" ")[5],
            y: line.split(" ")[8]
        })
    })
    return {categories, CO2, temp, humid, TVOC, labels}
}

const redraw_chart = () => {
    get_chart_data(num_readings).then(() => {
        chart1.updateSeries([
            {
                data: graph_data.CO2
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
                data: graph_data.TVOC
            }
        ])
    })

}




