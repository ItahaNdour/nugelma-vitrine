const WHATSAPP_NUMBER = "33758243146";

let products = [];
let cart = JSON.parse(localStorage.getItem("nugelmaCart")) || [];

const productsGrid = document.getElementById("productsGrid");
const cartButton = document.getElementById("cartButton");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const closeModal = document.getElementById("closeModal");
const cartItems = document.getElementById("cartItems");
const modalTotal = document.getElementById("modalTotal");
const whatsappButton = document.getElementById("whatsappButton");
const clearCartButton = document.getElementById("clearCartButton");
const filterButtons = document.querySelectorAll(".filter-btn");

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    products = await response.json();

    displayProducts(products);
    updateCart();
  } catch (error) {
    productsGrid.innerHTML = "<p>Impossible de charger les produits.</p>";
  }
}

function displayProducts(list) {
  productsGrid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h2 class="product-title">${product.name}</h2>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)} FCFA</span>
          <button class="add-btn" data-id="${product.id}">Ajouter au panier</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function addToCart(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
  renderCartModal();
}

function changeQuantity(id, action) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;
  }

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  updateCart();
  renderCartModal();
}

function getTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCart() {
  cartTotal.textContent = `${formatPrice(getTotal())} FCFA`;
  cartCount.textContent = getCartCount();
}

function renderCartModal() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide.</p>";
    modalTotal.textContent = "0 FCFA";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-details">${formatPrice(item.price)} FCFA × ${item.quantity}</p>
      </div>

      <div class="quantity-controls">
        <button onclick="changeQuantity(${item.id}, 'decrease')">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 'increase')">+</button>
        <button onclick="removeFromCart(${item.id})">×</button>
      </div>
    `;

    cartItems.appendChild(div);
  });

  modalTotal.textContent = `${formatPrice(getTotal())} FCFA`;
}

function generateWhatsAppMessage() {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  let message = "Bonjour Nugelma, je souhaite passer commande :\n";
  message += "---\n";

  cart.forEach(item => {
    message += `${item.quantity} x ${item.name} - ${formatPrice(item.price * item.quantity)} FCFA\n`;
  });

  message += "---\n";
  message += `TOTAL : ${formatPrice(getTotal())} FCFA\n`;
  message += "---\n";
  message += "Je souhaite recevoir les instructions de paiement pour valider l'achat de mes produits.";

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}

function saveCart() {
  localStorage.setItem("nugelmaCart", JSON.stringify(cart));
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
  renderCartModal();
}

function formatPrice(price) {
  return Number(price).toLocaleString("fr-FR");
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;

    if (category === "all") {
      displayProducts(products);
    } else {
      const filteredProducts = products.filter(product => product.category === category);
      displayProducts(filteredProducts);
    }
  });
});

cartButton.addEventListener("click", () => {
  renderCartModal();
  cartModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

cartModal.addEventListener("click", event => {
  if (event.target === cartModal) {
    cartModal.classList.add("hidden");
  }
});

whatsappButton.addEventListener("click", generateWhatsAppMessage);
clearCartButton.addEventListener("click", clearCart);

loadProducts();
