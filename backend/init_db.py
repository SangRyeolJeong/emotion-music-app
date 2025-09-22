"""
Database initialization script
"""
from app.db.base import engine, SessionLocal
from app.db.models import Base
from app.db.crud import create_user, get_user_by_email

def init_database():
    """Initialize database and create default user"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create default user
    db = SessionLocal()
    try:
        existing_user = get_user_by_email(db, email="user@example.com")
        if not existing_user:
            user = create_user(db, email="user@example.com", name="Test User")
            print(f"Created default user: {user.email} (ID: {user.id})")
        else:
            print(f"Default user already exists: {existing_user.email}")
    except Exception as e:
        print(f"Error creating default user: {e}")
    finally:
        db.close()
    
    print("Database initialization completed!")

if __name__ == "__main__":
    init_database()
