// -----------------------------------//
// Main Javascript functions for the prototype page

// Base path for API requests, change it to your local host ip and port or url of your deployed app
let base_path = 'http://127.0.0.1:5000/api/v1' //local

let live_update_on = false
let updating, chart_refresh
let chart1, chart2
let num_readings = 10
const device_id = window.appConfig.device_id

//-----------------------------------//
// ----- Settings functions ---------//
// All the settings are sent to the backend //
//-----------------------------------//


// Send new interval setting to the backend
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
    // restart the chart refresh with the new interval
    restart_chart_refresh(interval)
}

// Set threshold for CO2 and dust readings
const set_threshold = (sensor) => {
    let co2 = document.getElementById("new_co2_threshold").value
    let dust = document.getElementById("new_dust_threshold").value
    $.ajax({
        url: `${base_path}/set_threshold`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            threshold: sensor === 'co2' ? co2 : dust,
            sensor: sensor
        })
    })
}


// Set the number of last readings to be shown in the charts
const set_num_readings = () => {
    num_readings = document.getElementById("readings_num").value
    redraw_chart(num_readings)
}

// Restart charts update with the new interval. We don't need to update it more often than we read sensors
const restart_chart_refresh = (new_int) => {
    clearTimeout(chart_refresh)
    setInterval(redraw_chart
        , 1000 * new_int)
}

// Get current settings from the server.
// It gets: current readings interval, CO2 threshold, dust threshold, current status of the alarm,
// which of the readings are currently over the threshold
const get_settings = () => {
    $.ajax({
        url: `${base_path}/get_settings`,
        type: "GET",
        contentType: "application/json",
    }).done(data => {
        document.getElementById("cur_interval").innerText = data
            .interval
        document.getElementById("cur_co2_threshold").innerText = data
            .co2_threshold
        document.getElementById("cur_dust_threshold").innerText = data
            .dust_threshold

        // Showing or hiding the alert based on received settings
        if (!data.stop_alarm && data.alarm) show_alert()
        if (!data.stop_alarm && (data.co2_color === "red" || data.dust_color === "red")) show_alert()
        if (!data.alarm) hide_alert()
        if (data.co2_color !== "red" && data.dust_color !== "red") hide_alert()
        // Changing colours of the CO2 and Dust display
        toggle_element_color(data.co2_color, "co2")
        toggle_element_color(data.dust_color, "dust")
    })
}

// Show the alert
const show_alert = () => {
    document.getElementById("minor-alert").classList.remove("hidden")
}

// Hide the alert
const hide_alert = () => {
    document.getElementById("minor-alert").classList.add("hidden")
}

// Changing colour of the dust or CO2 display
const toggle_element_color = (value, name) => {
    let element = document.getElementById(name).classList
    if (value === "red") {
        element.remove("text-green-400")
        element.add("text-red-400")
    } else {
        element.remove("text-red-400")
        element.add("text-green-400")
    }
}

// Hide alert on the website and send a request to the backend
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

// Start constant updating of the latest data
const live_data = () => {
    if (!live_update_on) {
        live_update_on = true
        updating = setInterval(get_data, 1000 * 3)
    } else {
        live_update_on = false
        clearTimeout(updating)
    }

}


// Receive the latest data from the backend
// Update data on the page
const get_data = async () => {
    $.ajax({
        url: `${base_path}/get_readings`,
        type: "POST",
        data: JSON.stringify({
            device: device_id
        }),
        contentType: "application/json",
    }).done(data => {
        document.getElementById("temperature_c").innerHTML =
            data.temp
        document.getElementById("humidity").innerHTML = data.humid
        document.getElementById("dust").innerHTML = data.dust
        document.getElementById("co2").innerHTML =
            data.co2
        document.getElementById("tvoc").innerHTML =
            data.tvoc
        document.getElementById("reading_time").innerHTML = data.timestamp.split(" ")[1].split(".")[0]
    });
}