const items=[
{name:'Booba Tea',price:150},
{name:'Matcha Coffee',price:150},
{name:'Doki Doki Pancakes',price:200},
{name:'Strawberry Shortcake',price:200},
{name:'Om-Nom Omurice',price:350},
{name:'Sugoi Katsu Sando',price:350},
{name:'Bento Meal',price:800},
{name:'Mystery Box',price:50000}
];
let total=0;
const menu=document.getElementById('menu');
const cart=document.getElementById('cart');
items.forEach(i=>{
 const d=document.createElement('div');
 d.className='card';
 d.innerHTML=`<div class=item><span>${i.name}</span><span>$${i.price}</span></div><button>Add</button>`;
 d.querySelector('button').onclick=()=>{total+=i.price;cart.innerHTML+=`<div>${i.name} - $${i.price}</div>`;document.getElementById('total').textContent=total;};
 menu.appendChild(d);
});
function clearCart(){cart.innerHTML='';total=0;document.getElementById('total').textContent=0;}
function copyTotal(){navigator.clipboard.writeText(String(total));}
