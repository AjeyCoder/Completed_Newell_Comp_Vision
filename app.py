from flask import Flask 
import flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_session import Session

db = SQLAlchemy( )

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Ajeykey'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:12345@localhost/newell'
    app.config["SESSION_PERMANENT"] = False
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
    Session(app)
    db.init_app(app)
    migrate = Migrate(app, db)
    
    

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    from model import User
    @login_manager.user_loader
    def load_user(id):
        user = User.query.get(int(id))
        return user
    

    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from embedder import embedder as embedder_blueprint
    app.register_blueprint(embedder_blueprint)
    
    from modelwebcam import modelwebcam as modelwebcam_blueprint
    app.register_blueprint(modelwebcam_blueprint)
    
    return app
 

    


