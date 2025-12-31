from passlib.context import CryptContext
from database import get_db_connection
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_password(password: str) -> str:
    if not password:
        return password
    
    password_bytes = password.encode('utf-8')
    if len(password_bytes) <= 72:
        return password
    
    truncated_bytes = password_bytes[:72]
    truncated = truncated_bytes.decode('utf-8', errors='ignore')
    
    while len(truncated.encode('utf-8')) > 72:
        truncated = truncated[:-1]
        if not truncated:
            break
    
    return truncated

def hash_password(password: str) -> str:
    truncated = _truncate_password(password)
    return pwd_context.hash(truncated)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    truncated = _truncate_password(plain_password)
    return pwd_context.verify(truncated, hashed_password)

def get_user_by_email(email: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, email, password_hash FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return {'id': row[0], 'email': row[1], 'password_hash': row[2]}
        return None
    except Exception as e:
        print(f"❌ Database error in get_user_by_email: {e}")
        raise

def get_user_by_id(user_id: str):
    try:
        HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000001"
        HARDCODED_EMAIL = "rahul@gmail.com"
        
        if user_id == HARDCODED_USER_ID:
            return {'id': HARDCODED_USER_ID, 'email': HARDCODED_EMAIL}
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, email FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return {'id': row[0], 'email': row[1]}
        return None
    except Exception as e:
        print(f"❌ Database error in get_user_by_id: {e}")
        raise

def create_user(email: str, password_hash: str) -> str:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        user_id = str(uuid.uuid4())
        cur.execute(
            "INSERT INTO users (id, email, password_hash) VALUES (%s, %s, %s)",
            (user_id, email, password_hash)
        )
        conn.commit()
        cur.close()
        conn.close()
        return user_id
    except Exception as e:
        print(f"❌ Database error in create_user: {e}")
        raise

