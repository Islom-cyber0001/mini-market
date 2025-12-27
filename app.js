const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user || {};

let cart = [];
let orders = [];

// === PRODUCTS ===
const products = [
  {id:1,name:"Cola",price:10000,cat:"drink",img:"https://picsum.photos/100?1"},
  {id:2,name:"Fanta",price:9000,cat:"drink",img:"https://picsum.photos/100?2"},
  {id:3,name:"Un 1kg",price:7000,cat:"flour",img:"https://picsum.photos/100?3"},
  {id:4,name:"Un 5kg",price:32000,cat:"flour",img:"https://picsum.photos/100?4"},
  {id:5,name:"Shakar",price:8000,cat:"sugar",img:"https://picsum.photos/100?5"},
  {id:6,name:"Konfet",price:15000,cat:"sweet",img:"https://picsum.photos/100?6"},
  {id:7,name:"Tuz",price:2000,cat:"salt",img:"https://picsum.photos/100?7"},
  {id:8,name:"Yog‘",price:18000,cat:"oil",img:"https://picsum.photos/100?8"},
];

// === PAGE SWITCH ===
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// === MARKET ===
function renderMarket(list = products){
  const page = document.getElementById("page-market");
  page.innerHTML = "";

  list.forEach(p=>{
    page.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <div>
          <b>${p.name}</b><br>
          💰 ${p.price} so'm
          <button onclick="addToCart(${p.id})">🛒 Savatga</button>
        </div>
      </div>
    `;
  });
}

function filterCategory(cat, btn){
  document.querySelectorAll(".categories button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  if(cat==="all") renderMarket();
  else renderMarket(products.filter(p=>p.cat===cat));
}

// === CART ===
function addToCart(id){
  const p = products.find(x=>x.id===id);
  const ex = cart.find(x=>x.id===id);
  if(ex) ex.qty++;
  else cart.push({...p, qty:1});
  updateCart();
}

function updateCart(){
  document.getElementById("cart-count").innerText =
    cart.reduce((s,i)=>s+i.qty,0);
}

function renderCart(){
  const page = document.getElementById("page-cart");
  page.innerHTML = "<h2>🛍 Savat</h2>";
  if(cart.length===0){
    page.innerHTML+="<p>Savat bo‘sh</p>";
    return;
  }
  let total=0;
  cart.forEach((i,idx)=>{
    const sum=i.price*i.qty; total+=sum;
    page.innerHTML+=`
      <div class="product">
        <img src="${i.img}">
        <div>
          <b>${i.name}</b><br>
          ${i.price} so'm
          <div class="qty">
            <button onclick="changeQty(${idx},-1)">➖</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${idx},1)">➕</button>
          </div>
          <b>${sum} so'm</b>
        </div>
      </div>
    `;
  });
  page.innerHTML+=`
    <h3>💰 Jami: ${total} so'm</h3>
    <button class="cart-btn" onclick="sendOrder()">Buyurtma berish</button>
  `;
}

function changeQty(i,d){
  cart[i].qty+=d;
  if(cart[i].qty<=0) cart.splice(i,1);
  updateCart(); renderCart();
}

function sendOrder(){
  orders.push({items:cart, date:new Date().toLocaleString()});
  tg.sendData(JSON.stringify({cart}));
  cart=[]; updateCart();
  showPage("page-orders");
  renderOrders();
}

// === ORDERS ===
function renderOrders(){
  const page=document.getElementById("page-orders");
  page.innerHTML="<h2>📦 Buyurtmalar</h2>";
  if(orders.length===0){
    page.innerHTML+="<p>Hali buyurtma yo‘q</p>"; return;
  }
  orders.forEach((o,i)=>{
    page.innerHTML+=`<div class="profile-card">🆔 #${i+1}<br>${o.date}</div>`;
  });
}

// === PROFILE ===
function renderProfile(){
  const page=document.getElementById("page-profile");
  page.innerHTML=`
    <h2>👤 Profil</h2>
    <div class="profile-card">
      Ism: ${user.first_name||"-"}<br>
      Username: @${user.username||"-"}<br>
      ID: ${user.id||"-"}
    </div>
  `;
}

// === NAV ===
document.getElementById("nav-market").onclick=()=>{showPage("page-market")};
document.getElementById("nav-cart").onclick=()=>{showPage("page-cart");renderCart()};
document.getElementById("nav-profile").onclick=()=>{showPage("page-profile");renderProfile()};

// INIT
renderMarket();
