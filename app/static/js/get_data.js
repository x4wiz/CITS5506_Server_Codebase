base_path = 'http://127.0.0.1:5000/api/v1'

const get_data = async () => {
    $.ajax({
        url: `${base_path}/get_readings`,
        type: "GET",
        contentType: "application/json",
    }).done(function (data) {
    });
}

// console.log(get)

let container = document.getElementById("reading")
container.innerText