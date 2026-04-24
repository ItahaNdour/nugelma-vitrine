const products = [
    { id: 1, name: "Le Royal Chocolat", price: 15000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" },
    { id: 2, name: "Corbeille de Fruits", price: 5000, cat: "Frais", img: "https://images.unsplash.com/photo-1544650039-202c6d252108?w=500&q=80", surCommande: true },
    { id: 3, name: "Bougie Signature", price: 25000, cat: "Maison", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80" },
    { id: 4, name: "Assortiment Macarons", price: 12000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500&q=80" }
];

let cart = [];

function renderCatalog(filter = 'all') {
    const container = document.getElementById('catalog');
    container.innerHTML = '';
    
    const items = filter === 'all' ? products : products.filter(p => p.cat === filter);
    
    items.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <div class="img-box">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="price">${p.price.toLocaleString()} FCFA</p>
                    <button class="add-btn" onclick="addToCart(${p.id})">Ajouter au panier</button>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    cart.push(p);
    updateUI();
}

function updateUI() {
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    document.getElementById('cart-total').innerText = total.toLocaleString();
    document.getElementById('cart-count').innerText = cart.length;
}

function processOrder(btn) {
    if(cart.length === 0) return alert("Votre panier est vide.");

    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="loading"></span> Transmission...`;
    btn.disabled = true;

    setTimeout(() => {
        const phone = "221XXXXXXXXX"; // Numéro Nugelma
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        let items = cart.map(i => `- ${i.name}`).join('%0A');
        
        const message = `Bonjour Nugelma, je souhaite commander :%0A${items}%0A%0A*Total : ${total} FCFA*`;
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
}

function filterCat(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCatalog(cat);
}

// Lancement
renderCatalog();
