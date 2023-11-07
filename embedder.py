from PIL import Image
import cv2 
import numpy as np
from keras_facenet import FaceNet
from sklearn.metrics.pairwise import cosine_similarity
from deepface import DeepFace
from model import User , Profile
from psycopg2.extensions import register_adapter, AsIs
import numpy 
from flask import Flask, request, jsonify, current_app , session ,make_response
from app import db 
from flask import Blueprint  ,url_for, request, redirect 
import os




embedder = Blueprint('embedder' , __name__)


embedder1 = FaceNet()



def adapt_numpy_float32(numpy_float32):
    return AsIs(numpy_float32)

register_adapter(numpy.float32, adapt_numpy_float32)


@embedder.route('/upload_profile_pic', methods=['POST' , 'OPTIONS'])
def upload_profile_pic():
    if request.method == 'OPTIONS':
         resp13 = make_response()
         resp13.headers.add('Access-Control-Allow-Origin' , 'http://localhost:3000')
         resp13.headers.add('Access-Control-Allow-Methods' , '*')
         resp13.headers.add('Access-Control-Allow-Headers', '*')
         return resp13,200

    if request.method == 'POST':
       
       if 'file' not in request.files:
          resp14 = make_response({'error': 'No file provided'} )
          return resp14, 400

       file = request.files['file']
     
       if file.filename == ' ':
          resp15 = make_response({'error': 'No file selected'} )
          return resp15, 401
        
        
       if file:
         try:
           name = request.form.get('name')
           mobile_number = request.form.get('mobile_number')
           description = request.form.get('description')
           user = request.form.get('user')
           id = request.form.get('id' , type = int )
           email = request.form.get('email')
           cur_user = User.query.get(id)
           
           
           upload_folder = 'uploads'
           file_path = os.path.join(upload_folder, file.filename)
           file.save(file_path)
           
           
           print("Inside code 1")
           image = cv2.imread(file_path)
           image = np.expand_dims(image, axis=0)
           face = embedder1.embeddings(image)
         
         
           user_profile = Profile(
             email = email, 
             name=name,
             mobile_number=mobile_number,
             description=description,
             image_embedding=face, 
             author = cur_user 
             
           )
         
           
           db.session.add(user_profile)
           db.session.commit()
           resp16 = make_response({'message': 'Profile updated successfully'})
           return resp16, 201

         except Exception as e:
           error_message = f"Exception: {str(e)}"
           response_data = {'message': f'Profile update unsuccessful. {error_message}'}
           print(response_data)
           resp17 = make_response(response_data)
           return resp17 , 500
