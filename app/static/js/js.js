let base_path = 'https://smart-air-quality.herokuapp.com/api/v1'
//remote

// let base_path = 'http://192.168.1.127:5000/api/v1' //local
let live_update_on = false
let updating, chart_refresh
let chart1, chart2
let num_readings = 100

const set_interval = () => {
    let interval = document.getElementById("readings_interval").value
    $.ajax({
        url: `${base_path}/set_readings_interval`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            interval
        })
    })
    restart_chart_refresh(interval)
    console.log(interval)
}

const set_num_readings = () => {
    num_readings = document.getElementById("readings_num").value
    console.log(num_readings)
    redraw_chart(num_readings)
}

const restart_chart_refresh = (new_int) => {
    clearTimeout(chart_refresh)
    setInterval(redraw_chart
        , 1000 * new_int)

}

const get_settings = () => {
    $.ajax({
        url: `${base_path}/get_settings`,
        type: "GET",
        contentType: "application/json",
    }).done(data => {
        console.log(data)
        document.getElementById("cur_interval").innerText = data
            .interval
        console.log(!data.stop_alarm && data.alarm)
        if (!data.stop_alarm && data.alarm) show_alert()
        if (!data.alarm) hide_alert()
    })

}

const show_alert = () => {
    document.getElementById("minor-alert").classList.remove("hidden")
}

const hide_alert = () => {
    document.getElementById("minor-alert").classList.add("hidden")
}

const stop_alarm = () => {
    hide_alert()
    $.ajax({
        url: `${base_path}/stop_alarm`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            alarm: false
        })
    })
}

const live_data = () => {
    if (!live_update_on) {
        live_update_on = true
        updating = setInterval(get_data, 1000 * 3)
        // document.getElementById("const_upd").classList.add("bg-green-100")
    } else {
        live_update_on = false
        clearTimeout(updating)
        // document.getElementById("const_upd").classList.remove("bg-green-100")
    }

}

const get_data = async () => {
    $.ajax({
        url: `${base_path}/get_readings`,
        type: "GET",
        contentType: "application/json",
    }).done(data => {
        document.getElementById("temperature_c").innerText =
            data.temp + ' C'
        document.getElementById("humidity").innerText = data.humid
            + ' %'
        document.getElementById("heat_factor").innerText =
            data.heat + ' C'
        document.getElementById("dust").innerText = data.dust + ' mM'
        document.getElementById("co2").innerText =
            data.co2 + ' ppm'
        document.getElementById("tvoc").innerText =
            data.tvoc + ' ppb'
        document.getElementById("reading_date").innerText = data.timestamp.split(" ")[0]
        document.getElementById("reading_time").innerText = data.timestamp.split(" ")[1].split(".")[0]

    });
}