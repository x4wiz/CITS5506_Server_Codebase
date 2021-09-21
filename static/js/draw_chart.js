// let base_path = 'https://smart-air-quality.herokuapp.com/api/v1'
//remote
// let base_path = 'http://192.168.1.127:5000/api/v1' //local

let graph_data

const get_chart_data = async () => {
    // let prep_data

    await fetch(`${base_path}/get_chart_data`)
        .then(res => res.json())
        .then(res => {
            // console.log("res:", res)
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
    console.log("labels", labels)

    return {categories, CO2, temp, humid, TVOC, labels}
}

const redraw_chart = () => {
    get_chart_data().then(() => {
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


