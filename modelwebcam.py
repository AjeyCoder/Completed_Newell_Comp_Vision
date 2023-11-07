import cv2
import tensorflow as tf
import numpy as np
import os
from keras.models import load_model
from deepface import DeepFace
from flask import Blueprint , make_response , jsonify , request 
from flask_cors import cross_origin
import base64 
from keras_facenet import FaceNet
from sklearn.metrics.pairwise import cosine_similarity
from deepface import DeepFace
from model import Profile
from PIL import Image
from io import BytesIO
from datetime import datetime
from flask import Flask 


Paused = "False"
count = 0
gate = 0


embedder = FaceNet()
model = load_model("models/best_crime.h5")
modelwebcam = Blueprint('modelwebcam' , __name__)
profiles_dict = {}



def preprocess_frame_sus(frame):
   frame_data = frame["frames"]
   data_parts = frame_data.split(',')
   
   if len(data_parts) == 2:
      base64_data = data_parts[1]
      
   decoded_data = base64.b64decode(base64_data)
   image = cv2.imdecode(np.asarray(bytearray(decoded_data), dtype=np.int8), cv2.IMREAD_COLOR)
   resized_frame = cv2.resize(image, (240, 180))
   return resized_frame
   




def get_profiles(email):
    profiles = Profile.query.filter_by(email=email).all()
    profiles_list = []
    profile_data = {}
    for profile in profiles:
        profile_data = {
            'profile_name': profile.name,
            'profile_embedding': profile.image_embedding,
        }
        profiles_list.append(profile_data)

    return profiles_list

 

def preprocess_frame_face(frame):
   frame_data = frame["frames"]
   data_parts = frame_data.split(',')
   if len(data_parts) == 2:
      base64_data = data_parts[1]
   decoded_data = base64.b64decode(base64_data)
   image = cv2.imdecode(np.asarray(bytearray(decoded_data), dtype=np.int8), cv2.IMREAD_COLOR)
   return image 




@modelwebcam.route('/susactivity', methods=['POST' , 'OPTIONS'])
@cross_origin( )
def suspicious_act( ):
   if request.method == 'OPTIONS':
       resp = make_response()
       resp.headers.add('Access-Control-Allow-Origin' , 'http://localhost:3000')
       resp.headers.add('Access-Control-Allow-Methods' , '*')
       resp.headers.add('Access-Control-Allow-Headers', '*')
       return jsonify(resp),200
   else:
     
      frames_data  = request.get_json()
      frames_list = []
      flg = True
      response_frames_list = [ ]
      
      while True: 
       preprocessed_frame = preprocess_frame_sus(frames_data) 
       frames_list.append(preprocessed_frame) 
       if len(frames_list) > 10:
           frames_list.pop(0) 
           
         
       if len(frames_list) == 10 :
          input_data = np.stack(frames_list, axis=0) 
          input_data_1 = np.expand_dims(input_data, axis=0)
          predictions = model.predict(input_data_1)
          
          if np.max(predictions) < 0.6:
             print(predictions)
             resp1 = {'status' : "success_no_image"}
             return resp1 , 205 
          else:
             print(np.max(predictions))
             text = 'Fight' if np.argmax(predictions) == 0 else 'No Fight'
             if text == 'Fight':
                frame1 = cv2.putText(frames_list[9], text, (25 , 25), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
                output_folder = "sus_act_recogn"
                current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
                output_filename = f"{current_datetime}.jpg"
                output_file = os.path.join(output_folder, output_filename)
                cv2.imwrite(output_file, frame1, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
                image = cv2.imread(output_file)
                _, image_data = cv2.imencode(".png", image)
                base64_encoded = base64.b64encode(image_data).decode()
                data_url = f"data:image/png;base64,{base64_encoded}"

                response_data = {
                  'image_file': data_url,
                }
                return response_data ,201
             else: 
                resp2 = {'status' : "success_no_image"}
                return resp2,206
             


@modelwebcam.route('/facerecogniser', methods=['POST' , 'OPTIONS'])
@cross_origin( )
def face_recoginser( ):
   if request.method == 'OPTIONS':
      resp4 = make_response()
      resp4.headers.add('Access-Control-Allow-Origin' , 'http://localhost:3000')
      resp4.headers.add('Access-Control-Allow-Methods' , '*')
      resp4.headers.add('Access-Control-Allow-Headers', '*')
      return jsonify(resp4),200
   else:
     global count 
     global Paused 
     frames_data  = request.get_json()
     email = request.get_json( )
     email_1 = email.get('email', '')
     message = email.get('message', ' ')
     
     if message == "Camera paused" and count == 0 : 
        count = 1
        print("In the if")
        Paused = "True"
         
     if count == 0 and Paused == "False" :
       list = get_profiles(email_1)
       frames_list = []
       flg = True
       frames_list_1 = [ ]
     
       preprocessed_frame = preprocess_frame_face(frames_data) 
       detected_faces = DeepFace.extract_faces(preprocessed_frame, detector_backend="mtcnn", enforce_detection=False)
       frames_list.append(detected_faces) 
       frames_list_1.append(preprocessed_frame)
     
       while frames_list:
         if len(detected_faces) > 0:
           for idx, face in enumerate(frames_list[0]):
            if face['confidence'] < 0.95:
                continue
            
            x, y, w, h = face['facial_area'].values()
            x -= 20
            y -= 20
            w += 30
            h += 30
            x = max(x, 0)
            y = max(y, 0)
            w = min(w, frames_list_1[0].shape[1] - x)
            h = min(h, frames_list_1[0].shape[0] - y)


            face_image = cv2.resize(frames_list_1[0][y:y+h, x:x+w], (256, 256))
            face_image = np.expand_dims(face_image, axis=0)
            face_embeddings = embedder.embeddings(face_image)
            
            match_found = False
            
            for person in list:
                name = person['profile_name']
                person_embedding = person['profile_embedding']
                similarities = cosine_similarity(face_embeddings, person_embedding)
                max_similarity = max(similarities)
                print("max_similarity")
                print(max_similarity)
                
                if max_similarity > 0.5:
                    cv2.putText(frames_list_1[0], name, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                    output_folder = "face_recogniser"
                    
                    current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
                    output_filename = f"{current_datetime}.jpg"
                    output_file = os.path.join(output_folder, output_filename)
                    cv2.imwrite(output_file, frames_list_1[0], [int(cv2.IMWRITE_JPEG_QUALITY), 90])
                    
                    image = cv2.imread(output_file)
                    _, image_data = cv2.imencode(".png", image)
                    base64_encoded = base64.b64encode(image_data).decode()
                    data_url = f"data:image/png;base64,{base64_encoded}"

                    response_data = {
                      'image_file': data_url,
                    }
                    
                    match_found = True
                    
                    frames_list_1.pop(0)
                    frames_list.pop(0)
                    return response_data,201
                 
            if not match_found:
               resp2 = {'status' : "success_no_image"}
               frames_list_1.pop(0)
               frames_list.pop(0)
               return resp2,206
         else: 
          frames_list_1.pop(0)
          frames_list.pop(0)
     else: 
         response_data = {
            message: "Camera Paused",
         }       
         return response_data,220  
        
     
         
                  
            
      
      
      
                

      
             
          
          
          
               
               
               
               
             
            



         
      
         
            
                   
      