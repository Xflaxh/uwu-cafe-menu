const menuCategories = [
  {
    id: "drinks",
    icon: "images/uwudrinks.png",
    title: "Drinks",
    priceBadge: 150,
    items: [
      { id: "matcha-coffee", name: "Matcha Coffee", image: "images/matcha-coffee.png", price: 150 },
      { id: "hot-cocoa", name: "Hot Cocoa", image: "images/hot-cocoa.png", price: 150 },
      { id: "lovely-hot-cocoa", name: "Lovely Hot Cocoa", image: "images/lovely-hot-cocoa.png", price: 150 },
      { id: "sweet-herbal-tea", name: "Sweet Herbal Tea", image: "images/sweet-herbal-tea.png", price: 150 },
      { id: "perfect-parfait", name: "Perfect Parfait", image: "images/perfect-parfait.png", price: 200 },
      { id: "booba", name: "Booba Tea", image: "images/booba.png", price: 150 },
    ]
  },

  {
    id: "desserts",
    icon: "images/uwudessert.png",
    title: "Desserts",
    priceBadge: 200,
    items: [
      { id: "doki-pancakes", name: "Doki Doki Pancakes", image: "images/doki-pancakes.png", price: 200 },
      { id: "ginger-kitty-cookie", name: "Ginger Kitty Cookie", image: "images/ginger-kitty-cookie.png", price: 200 },
      { id: "ballaberry-cupcake", name: "Ballaberry Cupcake", image: "images/ballaberry-cupcake.png", price: 200 },
      { id: "cat-macaroon", name: "Cat Macaroon", image: "images/cat-macaroon.png", price: 200 },
      { id: "meowchi-mochi", name: "Meowchi Mochi", image: "images/meowchi-mochi.png", price: 200 },
      { id: "oxygen-cake", name: "Oxygen Cake", image: "images/oxygen-cake.png", price: 200 },
      { id: "strawberry-shortcake", name: "Strawberry Shortcake", image: "images/strawberry-shortcake.png", price: 200 }
    ]
  },

  {
    id: "lunch-dinner",
    title: "Lunch / Dinner",
    priceBadge: 350,
    items: [
      { id: "hamburg-steak", name: "Hamburg Steak", image: "images/hamburg-steak.png", price: 350 },
      { id: "kari-kari-curry", name: "Kari Kari Curry", image: "images/kari-kari-curry.png", price: 350 },
      { id: "om-nom-omurice", name: "Om-Nom Omurice", image: "images/om-nom-omurice.png", price: 350 },
      { id: "Rice-Ball", name: "Rice Ball", image: "images/rice-ball.png", price: 350 },
      { id: "sugoi-katsu-sando", name: "Sugoi Katsu Sando", image: "images/sugoi-katsu-sando.png", price: 350 }
    ]
  },

  {
    id: "specials",
    title: "Specials",
    showItemPrices: true,
    items: [
      { id: "bento-meal", name: "Bento Meal (Drink + Lunch/Dinner + Dessert + Rice Ball)", image: "images/bento-meal.png", price: 800 },
      { id: "mystery-box", name: "Mystery Box", image: "images/mystery-box.png", price: 50000 }
    ]
  }
];

const itemLookup = new Map();
menuCategories.forEach((category) => {
  category.items = category.items.map((item) => ({
    ...item,
    fallback: item.fallback || category.fallback || ""
  }));

  category.items.forEach((item) => {
    if (!itemLookup.has(item.id)) {
      itemLookup.set(item.id, item);
    }
  });
});

const cart = new Map();

let discountPercent = 0;
let discountMode = "none";

let menuGrid, cartItems, orderCount, subtotalAmount, discountLabel, discountAmount, totalAmount, savingsTitle, autoDiscountBtn, customDiscountBtn, copyTotalBtn, clearCartBtn, discountModal, discountForm, discountInput, discountHelp;

function renderMenu() {
  if (!menuGrid) return;
  menuGrid.innerHTML = menuCategories.map((category) => {
    const priceBadge = category.priceBadge
      ? `<span class="price-badge">${formatCurrency(category.priceBadge)}</span>`
      : "";

    const items = category.items.map((item) => {
      const itemPrice = category.showItemPrices
        ? `<small class="item-price">${formatCurrency(item.price)}</small>`
        : "";

      return `
        <div class="menu-item">
          <span class="thumb fallback-frame" data-fallback="${item.fallback}">
            <img src="${item.image}" alt="${item.name}" data-fallback-image>
          </span>
          <span class="item-meta">
            <span class="item-name">${item.name}</span>
            ${itemPrice}
          </span>
          <button class="add-button" type="button" data-action="add" data-id="${item.id}" aria-label="Add ${item.name} to order">
            <span class="add-button-icon" aria-hidden="true">+</span>
            <span class="add-button-label">Add</span>
          </button>
        </div>
      `;
    }).join("");

    return `
      <article class="menu-card ${category.wide ? "wide" : ""}">
        <header class="menu-card-header">
          <span class="category-icon fallback-frame" data-fallback="" aria-hidden="true">
            <img src="${category.icon}" alt="" data-fallback-image>
          </span>
          <h3 class="category-title">${category.title}</h3>
          ${priceBadge}
        </header>
        <div class="menu-items">
          ${items}
        </div>
      </article>
    `;
  }).join("");

  setupImageFallbacks(menuGrid);
}

function renderCart() {
  if (!cartItems || !orderCount || !subtotalAmount || !discountLabel || !discountAmount || !totalAmount || !savingsTitle) return;
  const items = Array.from(cart.values());
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = calculateTotals();

  orderCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  if (items.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
          <img src="images/empty-cart.png" class="empty-cart-icon" alt="Cute cat">
          <p>Your cart is empty!</p>
          <span>Add some yummy treats! ♡</span>
      </div>
    `;
  } else {
    cartItems.innerHTML = items.map((item) => `
      <div class="cart-item">
        <span class="thumb fallback-frame" data-fallback="${item.fallback}">
          <img src="${item.image}" alt="${item.name}" data-fallback-image>
        </span>
        <span class="item-meta">
          <span class="cart-name">${item.name}</span>
          <span class="cart-unit">${formatCurrency(item.price)} each</span>
        </span>
        <span class="quantity-control" aria-label="Quantity controls for ${item.name}">
          <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">&minus;</button>
          <input class="quantity-input" type="number" min="1" step="1" value="${item.quantity}" data-id="${item.id}" aria-label="Quantity for ${item.name}">
          <button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
        </span>
        <strong class="cart-line-total">${formatCurrency(item.price * item.quantity)}</strong>
        <button class="remove-button" type="button" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name} from order">&times;</button>
      </div>
    `).join("");
  }

  subtotalAmount.textContent = formatCurrency(totals.subtotal);
  discountLabel.textContent = `Discount (${discountPercent}%)`;
  discountAmount.textContent = totals.discount > 0 ? `-${formatCurrency(totals.discount)}` : formatCurrency(0);
  totalAmount.textContent = formatCurrency(totals.total);
  savingsTitle.textContent = totals.discount > 0 ? `You're saving ${discountPercent}%!` : "No discount applied.";

  autoDiscountBtn?.classList.toggle("is-active", discountMode === "auto" && discountPercent === 10);
  customDiscountBtn?.classList.toggle("is-active", discountMode === "custom");

  setupImageFallbacks(cartItems);
}

function setupImageFallbacks(scope = document) {
  if (!scope.querySelectorAll) return;

  scope.querySelectorAll("[data-fallback-image]").forEach((image) => {
    const frame = image.closest(".fallback-frame");
    const hideBrokenImage = () => {
      if (!frame) return;
      frame.classList.add("is-fallback");
      image.hidden = true;
    };

    image.addEventListener("error", hideBrokenImage, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      hideBrokenImage();
    }
  });
}

function addToCart(itemId) {
  const item = itemLookup.get(itemId);
  if (!item) return;

  const existing = cart.get(itemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(itemId, { ...item, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(itemId) {
  cart.delete(itemId);
  renderCart();
}

function increaseQuantity(itemId) {
  const item = cart.get(itemId);
  if (!item) return;

  item.quantity += 1;
  renderCart();
}

function decreaseQuantity(itemId) {
  const item = cart.get(itemId);
  if (!item) return;

  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart.delete(itemId);
  }

  renderCart();
}

function updateQuantity(itemId, newQuantity, shouldRender = true) {
  const item = cart.get(itemId);
  if (!item) return;

  const quantity = Math.round(Number(newQuantity));
  if (!Number.isFinite(quantity)) {
    if (shouldRender) renderCart();
    return;
  }

  if (quantity <= 0) {
    cart.delete(itemId);
    renderCart();
    return;
  }

  item.quantity = quantity;

  if (shouldRender) {
    renderCart();
  } else {
    refreshCartTotals();
  }
}

function calculateTotals() {
  const subtotal = Array.from(cart.values()).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = Math.max(subtotal - discount, 0);

  return { subtotal, discount, total };
}

function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString("en-US")}`;
}

function refreshCartTotals() {
  if (!orderCount || !subtotalAmount || !discountLabel || !discountAmount || !totalAmount || !savingsTitle) return;

  const itemCount = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  const totals = calculateTotals();

  orderCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  subtotalAmount.textContent = formatCurrency(totals.subtotal);
  discountLabel.textContent = `Discount (${discountPercent}%)`;
  discountAmount.textContent = totals.discount > 0 ? `-${formatCurrency(totals.discount)}` : formatCurrency(0);
  totalAmount.textContent = formatCurrency(totals.total);
  savingsTitle.textContent = totals.discount > 0 ? `You're saving ${discountPercent}%!` : "No discount applied.";
}

function normalizeQuantityInput(input, shouldRender = false) {
  const itemId = input.dataset.id;
  const item = cart.get(itemId);
  if (!item) return;

  if (input.value.trim() === "") {
    if (shouldRender) input.value = item.quantity;
    return;
  }

  const quantity = Math.round(Number(input.value));
  if (!Number.isFinite(quantity)) {
    input.value = item.quantity;
    return;
  }

  updateQuantity(itemId, quantity, shouldRender);

  const updatedItem = cart.get(itemId);
  if (!updatedItem) return;

  input.value = updatedItem.quantity;

  if (!shouldRender) {
    const cartItem = input.closest(".cart-item");
    const lineTotal = cartItem?.querySelector(".cart-line-total");
    if (lineTotal) lineTotal.textContent = formatCurrency(updatedItem.price * updatedItem.quantity);
  }
}

async function copyTotal() {
  const total = calculateTotals().total;
  const textToCopy = String(Math.round(total)).replace(/\D/g, "");

  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (error) {
    const temporaryInput = document.createElement("input");
    temporaryInput.value = textToCopy;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
  }

  if (copyTotalBtn) {
    const copyTotalLabel = copyTotalBtn.querySelector(".cart-action-btn__label");
    copyTotalBtn.classList.add("is-copied");
    if (copyTotalLabel) copyTotalLabel.textContent = "Copied!";
    window.setTimeout(() => {
      if (copyTotalLabel) copyTotalLabel.textContent = "Copy Price";
      copyTotalBtn.classList.remove("is-copied");
    }, 1500);
  }
}

function clearCart() {
  cart.clear();
  renderCart();
}

function setAutoDiscount() {
  if (discountMode === "auto" && discountPercent === 10) {
    discountMode = "none";
    discountPercent = 0;
  } else {
    discountMode = "auto";
    discountPercent = 10;
  }

  renderCart();
}

function setCustomDiscount() {
  openDiscountModal();
}

function openDiscountModal() {
  if (!discountModal || !discountInput || !discountHelp) return;

  discountInput.value = discountMode === "custom" ? discountPercent : "";
  discountHelp.textContent = "Enter a whole number from 0 to 100.";
  discountHelp.classList.remove("is-error");
  discountModal.hidden = false;
  discountInput.focus();
  discountInput.select();
}

function closeDiscountModal() {
  if (!discountModal) return;

  discountModal.hidden = true;
}

function applyCustomDiscount() {
  if (!discountInput || !discountHelp) return;

  const value = Number(discountInput.value.trim());
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    discountHelp.textContent = "Please enter a whole number from 0 to 100.";
    discountHelp.classList.add("is-error");
    discountInput.focus();
    return;
  }

  discountMode = "custom";
  discountPercent = Math.round(value);
  closeDiscountModal();
  renderCart();
}

function stepDiscountInput(amount) {
  if (!discountInput || !discountHelp) return;

  const currentValue = Number(discountInput.value);
  const safeValue = Number.isFinite(currentValue) ? currentValue : 0;
  const nextValue = Math.min(Math.max(Math.round(safeValue) + amount, 0), 100);

  discountInput.value = nextValue;
  discountHelp.textContent = "Enter a whole number from 0 to 100.";
  discountHelp.classList.remove("is-error");
  discountInput.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  menuGrid = document.getElementById("menuGrid");
  cartItems = document.getElementById("cartItems");
  orderCount = document.getElementById("orderCount");
  subtotalAmount = document.getElementById("subtotalAmount");
  discountLabel = document.getElementById("discountLabel");
  discountAmount = document.getElementById("discountAmount");
  totalAmount = document.getElementById("totalAmount");
  savingsTitle = document.getElementById("savingsTitle");
  autoDiscountBtn = document.getElementById("autoDiscountBtn");
  customDiscountBtn = document.getElementById("customDiscountBtn");
  copyTotalBtn = document.getElementById("copyTotalBtn");
  clearCartBtn = document.getElementById("clearCartBtn");
  discountModal = document.getElementById("discountModal");
  discountForm = document.getElementById("discountForm");
  discountInput = document.getElementById("discountInput");
  discountHelp = document.getElementById("discountHelp");

  if (menuGrid) menuGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "add") {
      addToCart(button.dataset.id);
    }
  });

  if (cartItems) cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const itemId = button.dataset.id;
    const action = button.dataset.action;

    if (action === "remove") removeFromCart(itemId);
    if (action === "increase") increaseQuantity(itemId);
    if (action === "decrease") decreaseQuantity(itemId);
  });

  if (cartItems) cartItems.addEventListener("input", (event) => {
    const input = event.target.closest(".quantity-input");
    if (!input) return;

    normalizeQuantityInput(input);
  });

  if (cartItems) cartItems.addEventListener("change", (event) => {
    const input = event.target.closest(".quantity-input");
    if (!input) return;

    normalizeQuantityInput(input, true);
  });

  if (cartItems) cartItems.addEventListener("blur", (event) => {
    const input = event.target.closest(".quantity-input");
    if (!input) return;

    normalizeQuantityInput(input, true);
  }, true);

  if (cartItems) cartItems.addEventListener("keydown", (event) => {
    const input = event.target.closest(".quantity-input");
    if (!input || event.key !== "Enter") return;

    event.preventDefault();
    normalizeQuantityInput(input, true);
  });

  if (autoDiscountBtn) autoDiscountBtn.addEventListener("click", setAutoDiscount);
  if (customDiscountBtn) customDiscountBtn.addEventListener("click", setCustomDiscount);
  if (copyTotalBtn) copyTotalBtn.addEventListener("click", copyTotal);
  if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
  if (discountForm) discountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyCustomDiscount();
  });
  if (discountModal) discountModal.addEventListener("click", (event) => {
    if (event.target.closest("[data-discount-close]")) closeDiscountModal();
    const stepButton = event.target.closest("[data-discount-step]");
    if (stepButton) stepDiscountInput(Number(stepButton.dataset.discountStep));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && discountModal && !discountModal.hidden) {
      closeDiscountModal();
    }
  });

  renderMenu();
  renderCart();
  setupImageFallbacks(document);
});