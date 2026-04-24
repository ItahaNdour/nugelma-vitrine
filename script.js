const products = [
    { id: 1, name: "Le Royal Chocolat", price: 15000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80" },
    { id: 2, name: "Plateau de Fruits", price: 8500, cat: "Frais", img: "https://images.unsplash.com/photo-1544650039-202c6d252108?w=600&q=80" },
    { id: 3, name: "Bougie Signature", price: 25000, cat: "Maison", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80" },
    { id: 4, name: "Coffret Macarons", price: 12000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600&q=80" }
];

let cart = [];

function render(category = 'all') {
    const container = document.getElementById('catalog');
    container.innerHTML = '';
    
    const filtered = category === 'all' ? products : products.filter(p => p.cat === category);
    
    filtered.forEach(p => {
        container.innerHTML += `
            <div class="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div class="aspect-square overflow-hidden relative">
                    <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="add-overlay absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 flex items-center justify-center">
                        <button onclick="addToCart(${p.id})" class="bg-white text-[#1A1A1A] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            Ajouter au panier
                        </button>
                    </div>
                </div>
                <div class="p-4 text-center">
                    <h3 class="font-serif text-[#1A1A1A] text-lg mb-1">${p.name}</h3>
                    <p class="text-[#D4AF37] font-bold">${p.price.toLocaleString()} FCFA</p>
                </div>
            </div>
        `;
    });
}

window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    
    // Feedback visuel (le badge)
    const badge = document.getElementById('cart-badge');
    badge.classList.remove('hidden');
    badge.innerText = cart.length;
    
    // Afficher la barre de panier
    const cartBar = document.getElementById('cart-bar');
    cartBar.classList.remove('hidden', 'translate-y-full');
    cartBar.classList.add('animate-slide-up');
};

function updateUI() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').innerText = `${total.toLocaleString()} FCFA`;
    document.getElementById('items-count').innerText = `${cart.length} articles`;
}

window.filter = (cat, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]');
        b.classList.add('bg-white', 'text-[#1A1A1A]', 'border-gray-200');
    });
    btn.classList.add('bg-[#1A1A1A]', 'text-white', 'border-[#1A1A1A]');
    render(cat);
};

window.sendToWA = () => {
    const phone = "22177XXXXXXX"; // Ton numéro
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    let items = cart.map(i => `- ${i.name}`).join('%0A');
    const msg = `Bonjour Nugelma, je souhaite commander :%0A${items}%0A%0A*Total : ${total} FCFA*`;
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
};

render();
