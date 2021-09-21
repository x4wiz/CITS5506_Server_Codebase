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

    data.map(line => {
        categories.push(line.split(" ")[5])
        CO2.push(line.split(" ")[7])
        temp.push(line.split(" ")[0])
        humid.push(line.split(" ")[1])
        TVOC.push(line.split(" ")[8])
    })

    // draw_chart(categories, CO2)
    // console.log(categories)
    return {categories, CO2, temp, humid, TVOC}
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


