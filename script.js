const products = [
    { id: 1, name: "Coffret Macarons Luxe", price: 15000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500&q=80" },
    { id: 2, name: "Poisson Capitaine Frais", price: 5000, cat: "Frais", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80", surCommande: true },
    { id: 3, name: "Bougie Artisanale", price: 8500, cat: "Maison", img: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=500&q=80" },
    { id: 4, name: "Éclairs au Chocolat", price: 12000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1620921515234-9725f0e34b17?w=500&q=80" }
];

let cart = [];

function render(filter = 'all') {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = '';
    
    const items = filter === 'all' ? products : products.filter(p => p.cat === filter);
    
    items.forEach(p => {
        catalog.innerHTML += `
            <div class="card">
                <div class="img-container">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} FCFA</p>
                <button class="add-btn" onclick="addToCart(${p.id})">Ajouter</button>
            </div>
        `;
    });
}

window.addToCart = (id) => {
    const p = products.find(prod => prod.id === id);
    cart.push(p);
    updateCart();
};

function updateCart() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total').innerText = total.toLocaleString();
    document.getElementById('count').innerText = cart.length;
}

window.filterCat = (cat, btn) => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(cat);
};

window.sendOrder = () => {
    if(cart.length === 0) return alert("Panier vide !");
    const phone = "221770000000"; // Ton numéro
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    let list = cart.map(i => `- ${i.name}`).join('%0A');
    window.open(`https://wa.me/${phone}?text=Bonjour Nugelma, voici ma commande :%0A${list}%0A%0A*Total: ${total} FCFA*`, '_blank');
};

render();
