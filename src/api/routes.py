"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=[ 'GET'])
def handle_users():

        all_users = User.query.all()
        return jsonify([user.serialize() for user in all_users]), 200
    
@api.route('/register', methods = ['POST'])
def handle_register():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'msg': 'Check JSON body'}), 400

    if not data.get('email') or not data.get('password'):
        return jsonify({'msg': 'Email and password are required'}), 400

    existing_user = User.query.filter(
        (User.email == data.get('email'))
    ).first()

    if existing_user:
        return jsonify({'msg': 'User with this email already exists'}), 400

    new_user = User(
        email=data.get('email'),
        password=generate_password_hash(data['password']),
        is_active=data.get('is_active', True)
    )

    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        'message': 'User registered',
        'access_token': access_token,
        'user': new_user.serialize()
    }), 201

@api.route('/login', methods=['POST'])
def handle_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid user'}), 401
        
        if not check_password_hash(user.password, password):
            return jsonify({'error': 'Invalid password'}), 401
        
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login exitoso',
            'access_token': access_token,
            'user': user.serialize()
        }), 200

@api.route('/protected', methods=['GET'])
@jwt_required()
def handle_protected():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if user is None:
         return jsonify({"Error": "User not found"})

    return jsonify({"id": user.id, "email": user.email }), 200