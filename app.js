const WHATSAPP_NUMBER = "221770000000";

const products = [
  {
    id: 1,
    name: "Gâteau chocolat",
    price: 15000,
    category: "Pâtisserie",
    description: "Gâteau premium, fondant et élégant.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 2,
    name: "Mini douceurs",
    price: 12000,
    category: "Pâtisserie",
    description: "Box raffinée pour vos événements.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 3,
    name: "Décoration chic",
    price: 18000,
    category: "Décoration",
    description: "Ambiance élégante et soignée.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 4,
    name: "Ballons premium",
    price: 8000,
    category: "Décoration",
    description: "Décor doux, festif et moderne.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 5,
    name: "Fruits frais",
    price: 10000,
    category: "Marché frais",
    description: "Sélection fraîche et de qualité.",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=70"
  },
  {
    id: 6,
    name: "Pack familial",
    price: 25000,
    category: "Marché frais",
    description: "Assortiment pratique du quotidien.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=70"
  }
];

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

function displayProducts(list) {
  productsGrid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h2 class="product-title">${product.name}</h2>
        <p class="product-description">${product.description}</p>
        <span class="product-price">${formatPrice(product.price)} FCFA</span>
        <button class="add-btn" data-id="${product.id}">Ajouter</button>
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
    cart.push({ ...product, quantity: 1 });
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

  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity -= 1;

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

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
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
      displayProducts(products.filter(product => product.category === category));
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

displayProducts(products);
updateCart();
