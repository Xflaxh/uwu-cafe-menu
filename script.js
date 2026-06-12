const data={
"🥤 Drinks":[["Boba Milk Tea",150],["Sweet Herbal Tea",150],["Lovely Hot Chocolate",150],["Hot Chocolate",150],["Matcha Coffee",150]],
"🍰 Desserts":[["Doki Doki Pancakes",200],["Ginger Kitty Cookie",200],["Meowchi Mochi",200],["Oxygen Cake",200],["Ballaberry Cupcake",200],["Perfect Parfait",200],["Strawberry Shortcake",200],["Pink Cat Macaroon",200],["Brown Cat Macaroon",200],["Green Cat Macaroon",200],["Turquoise Cat Macaroon",200],["Dragon's Fire",200]],
"🍛 Lunch & Dinner":[["Hamburg Steak",350],["Kira Kira Curry",350],["Om Nom Omurice",350],["Sugoi Katsu Sando",350],["Warm Chicken Noodle",350],["Awwdorrable Valentines Chocolate",350]],
"⭐ Specials":[["Rice Ball",350],["Bento Meal",800],["UwU Mystery Box",50000]]
};
let cart={},discount=0;
const wrap=document.getElementById('categories');
let html='<div class="grid">';
for(const c in data){html+=`<div class="category"><h2>${c}</h2>`;
data[c].forEach(i=>html+=`<div class=item><span>${i[0]} (${i[1]})</span><button class=add onclick="addItem('${i[0]}',${i[1]})">Add</button></div>`);
html+='</div>'}
html+='</div>';wrap.innerHTML=html;
function addItem(n,p){cart[n]?cart[n].q++:cart[n]={p,q:1};render()}
function change(n,v){cart[n].q+=v;if(cart[n].q<=0)delete cart[n];render()}
function render(){let sub=0,out='';for(const n in cart){let i=cart[n];sub+=i.p*i.q;out+=`<div class=cartItem><span>${n}<br>${i.p*i.q}</span><div class=qty><button onclick="change('${n}',-1)">-</button>${i.q}<button onclick="change('${n}',1)">+</button></div></div>`}
document.getElementById('cartItems').innerHTML=out;
let disc=sub*discount/100,total=Math.round(sub-disc);
subtotal.textContent=sub;discountAmt.textContent=Math.round(disc);disc.textContent=discount;total.textContent=total}
function applyDiscount(v){discount=v;render()}
function customDiscount(){let v=prompt('Discount %');if(v!==null){discount=Number(v)||0;render()}}
function clearCart(){cart={};render()}
function copyPrice(){navigator.clipboard.writeText(document.getElementById('total').textContent)}
