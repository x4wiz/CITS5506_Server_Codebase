# Smart Air Quality Project / Frontend
**Smart Air Quality** is a project developed by students of 
**CITS5506** unit of Master of Informational Technology course in UWA

**Smart Air Quality** is a portable device that measures quality of the air in rooms.

This is the server part of the project. For the device part please check this repo https://github.com/axel0410/CITS5506_Hardware_Codebase

# Installation
1. Install virtual environment library `pip3 install virtualenv`
2. Navigate to the folder with the project files and create virtual environment `virtualenv venv` 
3. Activate venv `source venv/bin/activate` 
4. Run `pip3 install -r requirements.txt`
5. Run `flask run`
6. Open in your browser <http://127.0.0.1:5000/>
7. Login with credentials student/1234

For the demonstration purpuses the app is set up to read an SQLight database which is prepopulated with some 
randomly generated data

The server expects data to be sent from the devices in the form:
`"data": "24 78 23 0.1 514 10 24ac4f6a4c-2"` where each figure is a reading from the device.
1 - temperature, 2 - humidity, 3 - heat factor, 4 - dust level, 5 - CO2, 6 - unique device identifier (based on MAC 
address)

### Test receiving data

To test, please navigate to the app/functions and run `python3 data_generator.py`. The latest data on the webpage 
should start updating.

Alternatively, send a manual request with curl
#### Linux / MacOS
`curl --header "Content-Type: application/json" -d "{\"data\":\"20 80 25 0.05 1300 8 24ac4f6a4c\"}" http://127.0.0.1:5000/api/v1/receive_data`
#### Windows
Same command but you might need to install curl package from here https://curl.se/download.html

You will see the new data displayed on the webpage. An alert should pop up as the CO2 reading is above 1000

### Online Site
1. Alternatively, navigate to the [herokuapp website]("https://smart-air-quality.herokuapp.com/") that hosts the 
   project. The login information is student/cits5506

## Authors
* **Evgeny Pimenov (21469397)**
* **Rishee Barthakur (22894636)**
* **Xiaoyu Yin (21982644)**
* **Isaac Huang (23019722)**
* **Shane Martinez (23227699)**