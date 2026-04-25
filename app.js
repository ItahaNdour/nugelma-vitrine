const WHATSAPP_NUMBER = "33758243146";

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
let finalWhatsappUrl = "";

const productsGrid = document.getElementById("productsGrid");
const cartButton = document.getElementById("cartButton");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const closeModal = document.getElementById("closeModal");
const cartItems = document.getElementById("cartItems");
const articlesTotal = document.getElementById("articlesTotal");
const deliveryFee = document.getElementById("deliveryFee");
const modalTotal = document.getElementById("modalTotal");
const confirmButton = document.getElementById("confirmButton");
const clearCartButton = document.getElementById("clearCartButton");
const filterButtons = document.querySelectorAll(".filter-btn");
const deliveryZone = document.getElementById("deliveryZone");
const deliveryDate = document.getElementById("deliveryDate");
const freshNotice = document.getElementById("freshNotice");
const thankYouModal = document.getElementById("thankYouModal");
const continueWhatsappButton = document.getElementById("continueWhatsappButton");
const closeThankYouModal = document.getElementById("closeThankYouModal");

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
  applyFreshRule();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
  renderCartModal();
  applyFreshRule();
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
  applyFreshRule();
}

function getArticlesTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function hasFreshMarketProduct() {
  return cart.some(item => item.category === "Marché frais");
}

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function applyFreshRule() {
  if (hasFreshMarketProduct()) {
    deliveryDate.min = getTomorrowDateString();

    if (!deliveryDate.value || deliveryDate.value < getTomorrowDateString()) {
      deliveryDate.value = getTomorrowDateString();
    }

    freshNotice.classList.remove("hidden");
  } else {
    deliveryDate.min = getTodayDateString();

    if (!deliveryDate.value) {
      deliveryDate.value = getTodayDateString();
    }

    freshNotice.classList.add("hidden");
  }
}

function getDeliveryInfo() {
  const selectedOption = deliveryZone.options[deliveryZone.selectedIndex];

  if (!selectedOption || !selectedOption.dataset.fee) {
    return {
      zone: "",
      fee: 0,
      label: "0 FCFA",
      isQuote: false
    };
  }

  if (selectedOption.dataset.fee === "devis") {
    return {
      zone: selectedOption.value,
      fee: 0,
      label: "Sur devis",
      isQuote: true
    };
  }

  const fee = Number(selectedOption.dataset.fee);

  return {
    zone: selectedOption.value,
    fee,
    label: `${formatPrice(fee)} FCFA`,
    isQuote: false
  };
}

function updateCart() {
  cartTotal.textContent = `${formatPrice(getArticlesTotal())} FCFA`;
  cartCount.textContent = getCartCount();
}

function renderCartModal() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide.</p>";
  } else {
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
  }

  const delivery = getDeliveryInfo();
  const totalArticles = getArticlesTotal();
  const totalGeneral = delivery.isQuote ? totalArticles : totalArticles + delivery.fee;

  articlesTotal.textContent = `${formatPrice(totalArticles)} FCFA`;
  deliveryFee.textContent = delivery.label;
  modalTotal.textContent = delivery.isQuote
    ? `${formatPrice(totalArticles)} FCFA + livraison sur devis`
    : `${formatPrice(totalGeneral)} FCFA`;

  applyFreshRule();
}

function validateForm() {
  const form = document.getElementById("orderForm");

  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return false;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  return true;
}

function getSelectedPaymentOption() {
  const selectedPayment = document.querySelector('input[name="paymentOption"]:checked');
  return selectedPayment ? selectedPayment.value : "";
}

function prepareWhatsAppMessage() {
  const name = document.getElementById("customerName").value.trim();
  const whatsapp = document.getElementById("customerWhatsapp").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const payment = getSelectedPaymentOption();
  const delivery = getDeliveryInfo();

  const totalArticles = getArticlesTotal();
  const totalGeneral = delivery.isQuote ? totalArticles : totalArticles + delivery.fee;
  const deliveryText = delivery.isQuote ? "Sur devis" : `${formatPrice(delivery.fee)} FCFA`;
  const totalGeneralText = delivery.isQuote
    ? `${formatPrice(totalGeneral)} FCFA + livraison sur devis`
    : `${formatPrice(totalGeneral)} FCFA`;

  let productsText = "";

  cart.forEach(item => {
    productsText += `${item.quantity} x ${item.name} - ${formatPrice(item.price * item.quantity)} FCFA\n`;
  });

  let message = `Bonjour Nugelma ! Nouvelle commande de : ${name}\n`;
  message += "---\n";
  message += `PRODUITS :\n${productsText}`;
  message += `TOTAL ARTICLES : ${formatPrice(totalArticles)} FCFA\n`;
  message += `LIVRAISON : ${delivery.zone} (${deliveryText})\n`;
  message += `TOTAL GÉNÉRAL : ${totalGeneralText}\n`;
  message += "---\n";
  message += `WHATSAPP : ${whatsapp}\n`;
  message += `DATE DE LIVRAISON : ${deliveryDate.value}\n`;
  message += `ADRESSE : ${address}\n`;
  message += `PAIEMENT : ${payment}\n`;
  message += "---\n";
  message += "👉 Je procède au paiement sur vos numéros indiqués et je vous envoie la capture d'écran ici pour valider ma commande.";

  finalWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openThankYouPopup() {
  if (!validateForm()) return;

  prepareWhatsAppMessage();

  cartModal.classList.add("hidden");
  thankYouModal.classList.remove("hidden");
}

function continueToWhatsApp() {
  if (!finalWhatsappUrl) return;

  window.open(finalWhatsappUrl, "_blank");
  thankYouModal.classList.add("hidden");
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

deliveryZone.addEventListener("change", renderCartModal);
deliveryDate.addEventListener("change", applyFreshRule);
confirmButton.addEventListener("click", openThankYouPopup);
continueWhatsappButton.addEventListener("click", continueToWhatsApp);

closeThankYouModal.addEventListener("click", () => {
  thankYouModal.classList.add("hidden");
});

clearCartButton.addEventListener("click", clearCart);

displayProducts(products);
updateCart();
applyFreshRule();
