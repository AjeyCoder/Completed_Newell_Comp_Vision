from flask import Blueprint , render_template ,url_for, request, redirect , session 
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required ,current_user
from passlib.hash import scrypt
from app import db 
from flask_cors import cross_origin 
from flask import Flask, request, jsonify, current_app , session ,make_response
from flask_sqlalchemy import SQLAlchemy
from model import User 


auth = Blueprint('auth' , __name__)


@auth.route('/signup', methods=['POST' , 'OPTIONS'])
@cross_origin( )
def signup():
    if request.method == 'OPTIONS':
         resp = make_response()
         resp.headers.add('Access-Control-Allow-Origin' , 'http://localhost:3000')
         resp.headers.add('Access-Control-Allow-Methods' , '*')
         resp.headers.add('Access-Control-Allow-Headers', '*')
         return jsonify(resp),200

    else:
       data = request.get_json()
       if  "email" not in data or "name" not in data or "password" not in data: 
            resp2 = make_response({'error': 'Invalid request'})
            return resp2,400
       
       email = data["email"]
       name = data["name"]
       password = data["password"]
       user = User.query.filter_by(email=email).first()

       if user:
           resp3 = make_response({'error': 'User already exists'} )
           return response3 , 409

       hashed_password = scrypt.hash(password)
       new_user = User(email=email, name=name, password=hashed_password)

       try:
            db.session.add(new_user)
            db.session.commit() 
            resp= { 
            'id': str(current_user.id),
            'email': str(current_user.email)
            }
            resp_1 = make_response(jsonify(resp))
            return resp_1, 201
       except Exception as e:
            db.session.rollback()  
            resp5 = make_response({'error': 'Registration failed'})
            return resp5,500


@auth.route('/login', methods=['POST' , 'OPTIONS' ])
@cross_origin( )
def login():
   if request.method == 'OPTIONS':
         resp6 = make_response()
         resp6.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
         resp6.headers.add('Access-Control-Allow-Methods', '*')
         resp6.headers.add('Access-Control-Allow-Headers', '*')
         return jsonify(resp6), 200


   if request.method == 'POST':
      data = request.get_json()
      if not data or "email" not in data or "password" not in data:
            resp6 = make_response({'error': 'Registration failed'}, )
            return resp6,400
      email = data["email"]
      password = data["password"]
      user = User.query.filter_by(email=email).first() 
      if user and scrypt.verify(password, user.password):
         login_user(user , remember = True)
         if current_user.is_authenticated:
             resp7 = make_response({'message': 'Login failed'})
             return resp7,201   
         else:
             resp8 = make_response({'message': 'Registration failed'})
             return resp8,401
   
    
@auth.route('/logout', methods=['POST' , 'OPTIONS' ])
@cross_origin( )
def logout():
     if request.method == 'OPTIONS':
         resp11 = make_response()
         resp11.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
         resp11.headers.add('Access-Control-Allow-Methods', '*')
         resp11.headers.add('Access-Control-Allow-Headers', '*')
         return jsonify(resp11), 200
     else: 
          logout_user( )
          resp12 = make_response({'message': 'Logout Sucessfull'})
          return resp12,201 
   



     
     
 