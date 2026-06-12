
const items=[
{name:'Booba Milk Tea',price:150},
{name:'Doki Doki Pancakes',price:200},
{name:'Om Nom Omurice',price:350}
];

let cart=[];
let discountPercent=0;

const menu=document.getElementById('menu');

items.forEach(item=>{
 const div=document.createElement('div');
 div.className='item';
 div.innerHTML=`${item.name} ($${item.price}) <button>Add</button>`;
 div.querySelector('button').onclick=()=>{cart.push(item);updateCart();};
 menu.appendChild(div);
});

function updateCart(){
 document.getElementById('cart').innerHTML=cart.map(x=>`<div>${x.name} - $${x.price}</div>`).join('');
 const subtotal=cart.reduce((s,x)=>s+x.price,0);
 const discount=Math.round(subtotal*discountPercent/100);
 const total=subtotal-discount;

 document.getElementById('subtotal').textContent='$'+subtotal;
 document.getElementById('discount').textContent='-$'+discount;
 document.getElementById('total').textContent='$'+total;
}

function applyDiscount(p){discountPercent=p;updateCart();}
function customDiscount(){const p=prompt('Discount %');discountPercent=parseFloat(p)||0;updateCart();}
function clearCart(){cart=[];discountPercent=0;updateCart();}
function copyTotal(){navigator.clipboard.writeText(document.getElementById('total').textContent);}
