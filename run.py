from  app import create_app
from flask_cors import CORS


cors_config  = {
    "origins" : ["http://localhost:3000"], 
    "allow_headers" : ['*'] , 
    "methods" :['*']
}


def run_flask_app():
    app = create_app()
    CORS(app , resource = {r"/api/v1/*" : cors_config} )  
    app.run(debug = True)
    

if __name__ == '__main__':
    run_flask_app( )