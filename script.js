
let cart=[];
let discountPercent=0;

function addItem(name,price){
 const existing=cart.find(x=>x.name===name);
 if(existing){existing.qty++;}
 else{cart.push({name,price,qty:1});}
 updateCart();
}

function updateCart(){
 let subtotal=0;
 const cartDiv=document.getElementById('cartItems');
 cartDiv.innerHTML='';

 cart.forEach(item=>{
  subtotal+=item.price*item.qty;
  cartDiv.innerHTML+=`<div>${item.name} x${item.qty} - $${item.price*item.qty}</div>`;
 });

 const discount=Math.floor(subtotal*(discountPercent/100));
 const total=subtotal-discount;

 document.getElementById('subtotal').textContent='$'+subtotal;
 document.getElementById('discount').textContent='-$'+discount;
 document.getElementById('total').textContent='$'+total;
}

function applyDiscount(percent){
 discountPercent=percent;
 updateCart();
}

function customDiscount(){
 const p=prompt('Enter discount percent');
 discountPercent=parseFloat(p)||0;
 updateCart();
}
