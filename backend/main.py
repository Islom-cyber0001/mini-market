from fastapi import FastAPI, Depends
from sqlalchemy import Column, Integer, String, Float, Text, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import json

# =====================
# DATABASE
# =====================
DATABASE_URL = "sqlite:///./orders.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# =====================
# MODEL
# =====================
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer)
    name = Column(String)
    phone = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    items = Column(Text)
    total = Column(Integer)
    status = Column(String, default="new")

Base.metadata.create_all(bind=engine)

# =====================
# APP
# =====================
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =====================
# ROUTES
# =====================

@app.get("/")
def root():
    return {"status": "backend ishlayapti"}

# 🔹 BUYURTMA YARATISH
@app.post("/orders")
def create_order(order: dict, db: Session = Depends(get_db)):
    items = order.get("items", [])

    total = 0
    for i in items:
        price = int(i.get("price", 0))
        qty = int(i.get("qty", 1))
        total += price * qty

    db_order = Order(
        telegram_id=order.get("telegram_id"),
        name=order.get("name"),
        phone=order.get("phone"),
        lat=order.get("lat"),
        lon=order.get("lon"),
        items=json.dumps(items),
        total=total,
        status="new"
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return {
        "id": db_order.id,
        "total": total,
        "status": db_order.status
    }

# 🔹 ADMIN UCHUN — HAMMA BUYURTMALAR
@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders
