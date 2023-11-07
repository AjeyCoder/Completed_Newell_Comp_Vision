from app import db
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION
import numpy
from psycopg2.extensions import register_adapter, AsIs

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(100))
    profiles = db.relationship('Profile', backref='author', lazy=True)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100))
    mobile_number = db.Column(db.String(15))
    description = db.Column(db.Text)
    image_embedding = db.Column(ARRAY(db.Float, dimensions=2))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    