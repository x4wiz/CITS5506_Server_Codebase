# Smart Air Quality Project / Frontend
**Smart Air Quality** is a project developed by students of 
**CITS5506** unit of Master of Informational Technology course in UWA

**Smart Air Quality** is a portable device that measures quality of the air in rooms.

This is the server part of the project. For the device part please check this repo https://github.com/axel0410/CITS5506_Hardware_Codebase

# Installation
1. Create virtual environment for the packages `pip install virtualenv`
2. Navigate to the folder with the project files and create virtual environment `virtualenv venv` 
3. Activate venv `source venv/bin/activate` 
4. Run `pip install -r requirements.txt`
5. Run `npm install`

## Running the project
### Running Locally
1. Run `pip install -r requirements.txt` in your virtual environment.
2. Run `flask run`
3. Navigate to <http://127.0.0.1:5000/>

### Online Site
1. Alternatively, navigate to the [herokuapp website]("https://chessquiz.herokuapp.com/") that hosts the project.

## Testing
### Prerequisites
1. Installing Seleniumm through `pip install selenium`
2. Installing the necessary [ChromeDriver]("https://chromedriver.storage.googleapis.com/index.html") for your system. 

### Instructions
1. Navigate to the directory where tests.py is located
2. Ensure Chrome/ChromeDriver is installed and in the path of tests.py
3. Run `python tests.py` or `python -m tests`  to run the tests

The tests are separated by Selenium and non-Selenium tests.
The tests uses a test account, the details are as follows: 

`username="userRegister", email="userRegister@email.com", password="userRegisterPW", password2="userRegisterPW`

The selenium tests connects to the [herokuapp website]("https://chessquiz.herokuapp.com/") that hosts the project.
The selenium tests uses an account specifically created for Selenium tests, the details are as follows: 

`username="testing", email="cits5505chess@gmail.com" password="testing", password2="testing"`

## Dependencies

* alembic==1.5.8
* blinker==1.4
* click==7.1.2
* dnspython==2.1.0
* dominate==2.6.0
* email-validator==1.1.2
* Flask==1.1.2
* Flask-Bootstrap==3.3.7.1
* Flask-Login==0.5.0
* Flask-Mail==0.9.1
* Flask-Migrate==2.7.0
* Flask-SQLAlchemy==2.5.1
* Flask-WTF==0.14.3
* greenlet==1.0.0
* gunicorn==20.1.0
* idna==3.1
* itsdangerous==1.1.0
* Jinja2==2.11.3
* Mako==1.1.4
* MarkupSafe==1.1.1
* psycopg2-binary==2.8.6
* PyJWT==2.0.1
* python-dateutil==2.8.1
* python-dotenv==0.17.0
* python-editor==1.0.4
* selenium==3.141.0
* six==1.15.0
* SQLAlchemy==1.4.9
* SQLAlchemy-serializer==1.3.4.4
* urllib3==1.26.4
* visitor==0.1.3
* Werkzeug==1.0.1
* WTForms==2.3.3

## Authors

* **Evgeny Pimenov (21469397)**
* **Jun Han Yap (22507198)**

## Git log
The full log is in [gitlog.txt](gitlog.txt)

## Acknowledgements
[White Queen Chess Piece]("https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Chess_piece_-_White_queen.jpg/131px-Chess_piece_-_White_queen.jpg") 

[White King Chess Piece]("https://upload.wikimedia.org/wikipedia/commons/7/7e/Chess_piece_-_White_king.jpg") 

Header collage - created by Evgeny