const tg = window.Telegram.WebApp;
tg.expand();

function send() {
  tg.sendData(JSON.stringify({
    cart: [
      { id: 1, name: "Cola", price: 10000, qty: 1 }
    ]
  }));
  tg.close();
}

