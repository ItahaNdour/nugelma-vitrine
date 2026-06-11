import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let shopSettings = { whatsapp: "221770000000", wave: "+221 77 000 00 00", orangeMoney: "+221 78 000 00 00", devise: "FCFA" };
let products = [];
let categories = [];
let cart = JSON.parse(localStorage.getItem("nugelmaCart")) || [];
let finalWhatsappUrl = "";

const productsGrid = document.getElementById("productsGrid");
const filtersContainer = document.getElementById("filtersContainer");
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
const deliveryZone = document.getElementById("deliveryZone");
const deliveryDate = document.getElementById("deliveryDate");
const freshNotice = document.getElementById("freshNotice");
const paymentModal = document.getElementById("paymentModal");
const continueWhatsappButton = document.getElementById("continueWhatsappButton");
const cancelPaymentButton = document.getElementById("cancelPaymentButton");
const closePaymentModal = document.getElementById("closePaymentModal");

async function loadSettings(){
  try{
    const snapshot = await getDoc(doc(db, "settings", "boutique"));
    if(snapshot.exists()) shopSettings = { ...shopSettings, ...snapshot.data() };
  }catch(error){ console.error("Erreur chargement settings :", error); }
}

async function loadProducts(){
  try{
    const querySnapshot = await getDocs(collection(db,"products"));
    products = [];
    querySnapshot.forEach((doc)=>{
      const data = doc.data();
      if(data.actif === false || data.disponible === false) return;
      products.push({ id: doc.id, ...data });
    });
    displayProducts(products);
  }catch(error){ console.error("Erreur chargement produits :", error); }
}

async function loadCategories(){
  try{
    const querySnapshot = await getDocs(collection(db,"categories"));
    categories = [];
    querySnapshot.forEach((doc)=> categories.push({ id: doc.id, ...doc.data() }));
    renderCategories();
  }catch(error){ console.error("Erreur chargement catégories :", error); }
}

function renderCategories(){
  filtersContainer.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.className = "category-card active";
  allButton.dataset.category = "all";
  allButton.style.backgroundImage = "url('https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=70')";
  allButton.innerHTML = `<div class="category-overlay"></div><span>Tout</span>`;
  filtersContainer.appendChild(allButton);
  categories.sort((a,b)=> (a.ordre || 999) - (b.ordre || 999)).forEach(category=>{
    if(category.actif !== true) return;
    const button = document.createElement("button");
    button.className = "category-card";
    button.dataset.category = category.nom;
    button.style.backgroundImage = `url('${category.image || ""}')`;
    button.innerHTML = `<div class="category-overlay"></div><span>${category.nom}</span>`;
    filtersContainer.appendChild(button);
  });
  activateFilters();
}

function activateFilters(){
  const filterButtons = document.querySelectorAll(".category-card");
  filterButtons.forEach(button=>{
    button.addEventListener("click",()=>{
      filterButtons.forEach(btn=>btn.classList.remove("active"));
      button.classList.add("active");
      const category = button.dataset.category;
      if(category === "all") return displayProducts(products);
      displayProducts(products.filter(product=> product.categorie === category || product.categorieSite === category || product.univers === category));
    });
  });
}

function displayProducts(list){
  productsGrid.innerHTML = "";
  if(list.length === 0){ productsGrid.innerHTML = `<p>Aucun produit disponible pour cette catégorie.</p>`; return; }
  list.forEach(product=>{
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `<img src="${product.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=70'}" alt="${product.nom || 'Produit Nugelma'}" loading="lazy"><div class="product-info"><p class="product-category">${product.categorieSite || product.categorie || product.univers || ""}</p><h2 class="product-title">${product.nom || "Produit Nugelma"}</h2><p class="product-description">${product.description || "Sélection premium Nugelma"}</p><span class="product-price">${formatPrice(product.prix || 0)} ${shopSettings.devise}</span><button class="add-btn" data-id="${product.id}">Ajouter</button></div>`;
    productsGrid.appendChild(card);
  });
  document.querySelectorAll(".add-btn").forEach(button=> button.addEventListener("click",()=> addToCart(button.dataset.id)));
}

function addToCart(id){
  const product = products.find(item=>item.id === id);
  if(!product) return;
  const existing = cart.find(item=>item.id === id);
  existing ? existing.quantity += 1 : cart.push({ ...product, quantity: 1 });
  saveCart(); updateCart();
}

function removeFromCart(id){ cart = cart.filter(item=>item.id !== id); saveCart(); updateCart(); renderCartModal(); }
function changeQuantity(id, action){ const item = cart.find(product=>product.id === id); if(!item) return; if(action === "increase") item.quantity += 1; if(action === "decrease") item.quantity -= 1; if(item.quantity <= 0) return removeFromCart(id); saveCart(); updateCart(); renderCartModal(); }
window.changeQuantity = changeQuantity; window.removeFromCart = removeFromCart;

function updateCart(){ cartTotal.textContent = `${formatPrice(getArticlesTotal())} ${shopSettings.devise}`; cartCount.textContent = getCartCount(); }
function getArticlesTotal(){ return cart.reduce((total,item)=> total + ((Number(item.prix) || 0) * item.quantity),0); }
function getCartCount(){ return cart.reduce((total,item)=> total + item.quantity,0); }
function saveCart(){ localStorage.setItem("nugelmaCart", JSON.stringify(cart)); }

function renderCartModal(){
  cartItems.innerHTML = "";
  if(cart.length === 0) cartItems.innerHTML = "<p>Votre panier est vide.</p>";
  cart.forEach(item=>{
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<div><strong>${item.nom}</strong><p>${item.quantity} × ${formatPrice(item.prix)} ${shopSettings.devise}</p></div><div class="qty-controls"><button onclick="changeQuantity('${item.id}', 'decrease')" type="button">−</button><span>${item.quantity}</span><button onclick="changeQuantity('${item.id}', 'increase')" type="button">+</button><button onclick="removeFromCart('${item.id}')" type="button">×</button></div>`;
    cartItems.appendChild(div);
  });
  updateTotals(); applyFreshRule();
}

function getDeliveryInfo(){
  const selectedOption = deliveryZone.options[deliveryZone.selectedIndex];
  if(!selectedOption || !selectedOption.dataset.fee) return { zone: "", fee: 0, label: `0 ${shopSettings.devise}`, isQuote: false };
  if(selectedOption.dataset.fee === "devis") return { zone: selectedOption.value, fee: 0, label: "Sur devis", isQuote: true };
  const fee = Number(selectedOption.dataset.fee);
  return { zone: selectedOption.value, fee, label: `${formatPrice(fee)} ${shopSettings.devise}`, isQuote: false };
}

function updateTotals(){
  const delivery = getDeliveryInfo(); const totalArticles = getArticlesTotal(); const totalGeneral = delivery.isQuote ? totalArticles : totalArticles + delivery.fee;
  articlesTotal.textContent = `${formatPrice(totalArticles)} ${shopSettings.devise}`;
  deliveryFee.textContent = delivery.label;
  modalTotal.textContent = delivery.isQuote ? `${formatPrice(totalArticles)} ${shopSettings.devise} + livraison sur devis` : `${formatPrice(totalGeneral)} ${shopSettings.devise}`;
}

function hasFreshProduct(){ return cart.some(item=> `${item.categorie || ""} ${item.categorieSite || ""} ${item.univers || ""}`.toLowerCase().includes("frais") || `${item.categorie || ""} ${item.categorieSite || ""} ${item.univers || ""}`.toLowerCase().includes("marché")); }
function getTodayDateString(){ const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); return today.toISOString().split("T")[0]; }
function getTomorrowDateString(){ const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset()); return tomorrow.toISOString().split("T")[0]; }
function applyFreshRule(){ const today = getTodayDateString(); const tomorrow = getTomorrowDateString(); if(hasFreshProduct()){ deliveryDate.min = tomorrow; if(!deliveryDate.value || deliveryDate.value <= today) deliveryDate.value = tomorrow; freshNotice.classList.remove("hidden"); } else { deliveryDate.min = today; if(!deliveryDate.value) deliveryDate.value = today; freshNotice.classList.add("hidden"); } }

function validateOrderForm(){ const form = document.getElementById("orderForm"); if(cart.length === 0){ alert("Votre panier est vide."); return false; } if(!form.checkValidity()){ form.reportValidity(); return false; } return true; }
function getSelectedPaymentOption(){ const selected = document.querySelector('input[name="paymentOption"]:checked'); return selected ? selected.value : ""; }

function prepareWhatsAppMessage(){
  const name = document.getElementById("customerName").value.trim(); const whatsapp = document.getElementById("customerWhatsapp").value.trim(); const address = document.getElementById("customerAddress").value.trim(); const payment = getSelectedPaymentOption(); const delivery = getDeliveryInfo();
  const totalArticles = getArticlesTotal(); const totalGeneral = delivery.isQuote ? totalArticles : totalArticles + delivery.fee; const deliveryText = delivery.isQuote ? "Sur devis" : `${formatPrice(delivery.fee)} ${shopSettings.devise}`; const totalGeneralText = delivery.isQuote ? `${formatPrice(totalGeneral)} ${shopSettings.devise} + livraison sur devis` : `${formatPrice(totalGeneral)} ${shopSettings.devise}`;
  let productsText = ""; cart.forEach(item=> productsText += `${item.quantity} x ${item.nom} - ${formatPrice((item.prix || 0) * item.quantity)} ${shopSettings.devise}\n`);
  let message = `Bonjour Nugelma ! Nouvelle commande de : ${name}\n`; message += "---\n"; message += `PRODUITS :\n${productsText}`; message += `TOTAL ARTICLES : ${formatPrice(totalArticles)} ${shopSettings.devise}\n`; message += `LIVRAISON : ${delivery.zone} (${deliveryText})\n`; message += `TOTAL GÉNÉRAL : ${totalGeneralText}\n`; message += "---\n"; message += `WHATSAPP : ${whatsapp}\n`; message += `DATE DE LIVRAISON : ${deliveryDate.value}\n`; message += `ADRESSE : ${address}\n`; message += `PAIEMENT : ${payment}\n`; message += "---\n"; message += "👉 Je procède au paiement sur vos numéros indiqués et je vous envoie la capture d'écran ici pour valider ma commande.";
  finalWhatsappUrl = `https://wa.me/${shopSettings.whatsapp}?text=${encodeURIComponent(message)}`;
}

function openPaymentModal(){ if(!validateOrderForm()) return; prepareWhatsAppMessage(); cartModal.classList.add("hidden"); paymentModal.classList.remove("hidden"); }
function continueToWhatsApp(){ if(!finalWhatsappUrl) return; window.open(finalWhatsappUrl, "_blank"); paymentModal.classList.add("hidden"); }
function clearCart(){ cart = []; saveCart(); updateCart(); renderCartModal(); }
function formatPrice(price){ return Number(price).toLocaleString("fr-FR"); }

cartButton.addEventListener("click",()=>{ renderCartModal(); cartModal.classList.remove("hidden"); });
closeModal.addEventListener("click",()=> cartModal.classList.add("hidden"));
cartModal.addEventListener("click",(event)=>{ if(event.target === cartModal) cartModal.classList.add("hidden"); });
paymentModal.addEventListener("click",(event)=>{ if(event.target === paymentModal) paymentModal.classList.add("hidden"); });
deliveryZone.addEventListener("change", updateTotals); deliveryDate.addEventListener("change", applyFreshRule); confirmButton.addEventListener("click", openPaymentModal); continueWhatsappButton.addEventListener("click", continueToWhatsApp); cancelPaymentButton.addEventListener("click",()=> paymentModal.classList.add("hidden")); closePaymentModal.addEventListener("click",()=> paymentModal.classList.add("hidden")); clearCartButton.addEventListener("click", clearCart);

document.querySelectorAll(".copy-btn").forEach(button=> button.addEventListener("click",async()=>{ try{ await navigator.clipboard.writeText(button.dataset.copy); button.textContent = "✅ Copié"; setTimeout(()=> button.textContent = "📋 Copier",1800); }catch(error){ alert("Copie impossible."); } }));

async function init(){ await loadSettings(); await loadCategories(); await loadProducts(); applyFreshRule(); updateCart(); }
init();
