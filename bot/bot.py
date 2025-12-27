import telebot
from telebot import types
import requests
import json

BOT_TOKEN = "8599642646:AAEJoq1GqzY9Jb9i2NouzOj0aXkYE7MVJmY"
API_URL = "http://127.0.0.1:8000/orders"

bot = telebot.TeleBot(BOT_TOKEN)

# /start
@bot.message_handler(commands=["start"])
def start(msg):
    kb = types.ReplyKeyboardMarkup(resize_keyboard=True)
    kb.add(
        types.KeyboardButton(
            "🛒 Katalog",
            web_app=types.WebAppInfo(
                url="https://islom-cyber0001.github.io/mini-market/"
            )
        )
    )
    bot.send_message(
        msg.chat.id,
        "🛒 Mini Market\nBuyurtma berish uchun katalogni oching",
        reply_markup=kb
    )

# MINI APP → BUYURTMA
@bot.message_handler(content_types=["web_app_data"])
def web_app_data(msg):
    data = json.loads(msg.web_app_data.data)

    payload = {
        "telegram_id": msg.chat.id,
        "name": msg.from_user.first_name or "No name",
        "phone": "unknown",
        "lat": 0,
        "lon": 0,
        "items": data.get("cart", [])
    }

    r = requests.post(API_URL, json=payload)

    if r.status_code != 200:
        bot.send_message(msg.chat.id, "❌ Backend xato berdi")
        return

    res = r.json()

    bot.send_message(
        msg.chat.id,
        f"✅ Buyurtma qabul qilindi!\n🆔 Buyurtma ID: {res['id']}",
        reply_markup=types.ReplyKeyboardRemove()
    )

print("🤖 Bot ishlayapti...")
bot.infinity_polling()
