from passlib.context import CryptContext 
from jose import jwt ,JWTError  
from fastapi import Depends,HTTPException 
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db 
from models import User

SECRET_KEY ='meesho_clone_secret_key' 
ALGORITHM='HS256' 

pwd_context=CryptContext(     
    schemes=['bcrypt'],
    deprecated='auto'
)   
security=HTTPBearer() 
def hash_password(password:str):
    return pwd_context.hash(password) 

def verify_password(password:str,hashed_password:str): 
    return pwd_context.verify(password,hashed_password) 

def create_token(user_id:int):
    data={'user_id':user_id}
    return jwt.encode(data,SECRET_KEY,algorithm=ALGORITHM)
def get_current_user(credentials:HTTPAuthorizationCredentials=Depends(security),
                     db:Session=Depends(get_db)):
    token=credentials.credentials
    try:
        payload=jwt.decode(
            token,SECRET_KEY,algorithms=[ALGORITHM]
        )
        user_id=payload.get('user_id') 
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail='Invalid token'
         )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail='Invalid token'
        )
    user=db.query(User).filter(
        User.id==user_id
    ).first() 
    if not user:
        raise HTTPException(
            status_code=404, 
            detail='User not found'
        )
    return user


def seller_required(current_user:User=Depends(get_current_user)):
    if current_user.role!='seller':
        raise HTTPException(
            status_code=403, 
            detail='Only sellers can perfrom this action'
        )
    return current_user
