
const items=[
{name:'Boba Milk Tea',price:150},
{name:'Matcha Coffee',price:150},
{name:'Doki Doki Pancakes',price:200},
{name:'Hamburg Steak',price:350},
{name:'Rice Ball',price:350},
{name:'Bento Meal',price:800},
{name:'UwU Mystery Box',price:50000}
];

let cart=[];
let discount=0;

const menu=document.getElementById('menu');
items.forEach(i=>{
 const d=document.createElement('div');
 d.className='card';
 d.innerHTML=`<span>${i.name} (${i.price})</span><button>Add</button>`;
 d.querySelector('button').onclick=()=>addItem(i);
 menu.appendChild(d);
});

function addItem(item){cart.push(item);render();}
function applyDiscount(v){discount=v;render();}
function customDiscount(){const v=prompt('Discount %');if(v)discount=Number(v);render();}
function clearCart(){cart=[];render();}
function render(){
 let subtotal=cart.reduce((a,b)=>a+b.price,0);
 let total=Math.round(subtotal*(1-discount/100));
 document.getElementById('subtotal').textContent=subtotal;
 document.getElementById('discount').textContent=discount+'%';
 document.getElementById('total').textContent=total;
 document.getElementById('cartItems').innerHTML=cart.map(i=>`<div>${i.name}</div>`).join('');
}
function copyPrice(){
 navigator.clipboard.writeText(document.getElementById('total').textContent);
}
