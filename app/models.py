from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app import login


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# DB models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, db.Identity(start=1, cycle=True), primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    devices = db.relationship('Device', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Device(db.Model):
    id = db.Column(db.Integer, db.Identity(start=1, cycle=True), primary_key=True)
    serial_num = db.Column(db.String(20))
    title = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    data = db.relationship('Data', backref='device', lazy=True)


class Data(db.Model):
    id = db.Column(db.Integer, db.Identity(start=1, cycle=True), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    temp = db.Column(db.Float)
    humid = db.Column(db.Float)
    heat = db.Column(db.Float)
    dust = db.Column(db.Float)
    co2 = db.Column(db.Integer)
    tvoc = db.Column(db.Integer)
    device_id = db.Column(db.Integer, db.ForeignKey('device.id'))

    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in
                self.__table__.columns}
