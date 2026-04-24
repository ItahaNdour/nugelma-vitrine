// 1. Données - Dans le futur, ceci peut être chargé depuis un fichier produits.json
const catalog = [
    { id: 1, name: "Gâteau Royal Chocolat", price: 15000, cat: "Pâtisserie", img: "https://via.placeholder.com/200" },
    { id: 2, name: "Plateau de Gambas", price: 12000, cat: "Frais", img: "https://via.placeholder.com/200", surCommande: true },
    { id: 3, name: "Diffuseur Ambiance", price: 9500, cat: "Maison", img: "https://via.placeholder.com/200" },
    { id: 4, name: "Tarte Citron Meringuée", price: 8000, cat: "Pâtisserie", img: "https://via.placeholder.com/200" }
];

let cart = JSON.parse(localStorage.getItem('nugelma_cart')) || [];

// 2. Fonctions d'affichage
function displayProducts(category = 'all') {
    const container = document.getElementById('catalog-container');
    container.innerHTML = '';

    const filtered = category === 'all' ? catalog : catalog.filter(p => p.cat === category);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <h3>${p.name}</h3>
            ${p.surCommande ? '<span class="frais-tag">Sur commande uniquement</span>' : ''}
            <p class="price">${p.price.toLocaleString()} FCFA</p>
            <button class="add-btn" onclick="addToCart(${p.id})">Ajouter au panier</button>
        `;
        container.appendChild(card);
    });
}

// 3. Gestion du panier
window.addToCart = function(id) {
    const item = catalog.find(p => p.id === id);
    cart.push(item);
    updateUI();
};

function updateUI() {
    localStorage.setItem('nugelma_cart', JSON.stringify(cart));
    
    // Calcul du total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').innerText = total.toLocaleString();
    document.getElementById('cart-count').innerText = cart.length;
}

// 4. Envoi WhatsApp
document.getElementById('whatsapp-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }

    const phone = "22177XXXXXXX"; // Ton numéro WhatsApp Business
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Création du récapitulatif
    let message = "Bonjour Nugelma, je souhaite passer une commande :\n\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price} FCFA\n`;
    });
    message += `\n*Total : ${total} FCFA*`;

    // Encodage pour URL
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
});

// 5. Gestion des filtres
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.cat-btn.active').classList.remove('active');
        e.target.classList.add('active');
        displayProducts(e.target.getAttribute('data-cat'));
    });
});

// Initialisation
displayProducts();
updateUI();