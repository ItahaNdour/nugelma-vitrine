import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1iFadrRMX6uvkCMut7XufYJkx-1XAJio",
  authDomain: "ndugeulma.firebaseapp.com",
  projectId: "ndugeulma",
  storageBucket: "ndugeulma.firebasestorage.app",
  messagingSenderId: "8387015205",
  appId: "1:8387015205:web:c1111529ef99f52d1545cc",
  measurementId: "G-62ZW70S63P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WHATSAPP_NUMBER = "221770000000";

let products = [];
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

async function loadProducts(){

  try{

    const querySnapshot = await getDocs(collection(db,"products"));

    products = [];

    querySnapshot.forEach((doc)=>{

      products.push({
        id:doc.id,
        ...doc.data()
      });

    });

    displayProducts(products);

    console.log(products);

  }catch(error){

    console.error(error);

  }

}

function displayProducts(list){

  productsGrid.innerHTML = "";

  list.forEach(product=>{

    const card = document.createElement("article");

    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=70'}">

      <div class="product-info">

        <p class="product-category">
          ${product.categorie || ""}
        </p>

        <h2 class="product-title">
          ${product.nom || ""}
        </h2>

        <p class="product-description">
          Produit premium Nugelma
        </p>

        <span class="product-price">
          ${formatPrice(product.prix || 0)} FCFA
        </span>

        <button class="add-btn" data-id="${product.id}">
          Ajouter
        </button>

      </div>
    `;

    productsGrid.appendChild(card);

  });

  document.querySelectorAll(".add-btn").forEach(button=>{

    button.addEventListener("click",()=>{

      addToCart(button.dataset.id);

    });

  });

}

function addToCart(id){

  const product = products.find(item=>item.id === id);

  if(!product) return;

  const existing = cart.find(item=>item.id === id);

  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({
      ...product,
      quantity:1
    });

  }

  saveCart();

  updateCart();

}

function updateCart(){

  cartTotal.textContent = `${formatPrice(getArticlesTotal())} FCFA`;

  cartCount.textContent = getCartCount();

}

function getArticlesTotal(){

  return cart.reduce((total,item)=>{

    return total + ((item.prix || 0) * item.quantity);

  },0);

}

function getCartCount(){

  return cart.reduce((total,item)=>{

    return total + item.quantity;

  },0);

}

function saveCart(){

  localStorage.setItem("nugelmaCart",JSON.stringify(cart));

}

function renderCartModal(){

  cartItems.innerHTML = "";

  cart.forEach(item=>{

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <strong>${item.nom}</strong>
        <p>${item.quantity} × ${formatPrice(item.prix)} FCFA</p>
      </div>
    `;

    cartItems.appendChild(div);

  });

  const total = getArticlesTotal();

  articlesTotal.textContent = `${formatPrice(total)} FCFA`;

  modalTotal.textContent = `${formatPrice(total)} FCFA`;

}

function formatPrice(price){

  return Number(price).toLocaleString("fr-FR");

}

cartButton.addEventListener("click",()=>{

  renderCartModal();

  cartModal.classList.remove("hidden");

});

closeModal.addEventListener("click",()=>{

  cartModal.classList.add("hidden");

});

confirmButton.addEventListener("click",()=>{

  cartModal.classList.add("hidden");

  thankYouModal.classList.remove("hidden");

});

continueWhatsappButton.addEventListener("click",()=>{

  let productsText = "";

  cart.forEach(item=>{

    productsText += `${item.quantity} x ${item.nom}\n`;

  });

  const message = `
Bonjour Nugelma !

${productsText}

TOTAL : ${formatPrice(getArticlesTotal())} FCFA
`;

  finalWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(finalWhatsappUrl,"_blank");

});

closeThankYouModal.addEventListener("click",()=>{

  thankYouModal.classList.add("hidden");

});

clearCartButton.addEventListener("click",()=>{

  cart = [];

  saveCart();

  updateCart();

  renderCartModal();

});

document.querySelectorAll(".copy-btn").forEach(button=>{

  button.addEventListener("click",async()=>{

    try{

      await navigator.clipboard.writeText(button.dataset.copy);

      button.textContent = "✅ Copié";

      setTimeout(()=>{

        button.textContent = "📋 Copier";

      },1800);

    }catch(error){

      alert("Copie impossible");

    }

  });

});

filterButtons.forEach(button=>{

  button.addEventListener("click",()=>{

    filterButtons.forEach(btn=>{

      btn.classList.remove("active");

    });

    button.classList.add("active");

    const category = button.dataset.category;

    if(category === "all"){

      displayProducts(products);

    }else{

      const filtered = products.filter(product=>{

        return product.categorie === category;

      });

      displayProducts(filtered);

    }

  });

});

updateCart();

loadProducts();
