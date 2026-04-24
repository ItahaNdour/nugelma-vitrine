const products = [
    { id: 1, name: "Le Royal Gold", price: 18500, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800", desc: "Mousse chocolat noir, croustillant praliné et feuilles d'or pur." },
    { id: 2, name: "Capitaine du Port", price: 8500, cat: "Frais", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800", desc: "Pêche locale du matin, filet sélectionné pour sa tendreté." },
    { id: 3, name: "Bougie Ambre Noire", price: 24000, cat: "Maison", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800", desc: "Cire végétale, senteur intense boisée et épicée." },
    { id: 4, name: "Coffret Impérial", price: 14000, cat: "Pâtisserie", img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800", desc: "Sélection de 16 macarons artisanaux aux saveurs du Sénégal." }
];

let cart = [];

function render(category = 'all') {
    const container = document.getElementById('catalog');
    container.innerHTML = '';
    
    const filtered = category === 'all' ? products : products.filter(p => p.cat === category);
    
    filtered.forEach(p => {
        container.innerHTML += `
            <div class="product-card group flex flex-col bg-white rounded-[3.5rem] p-5 card-shadow transition-all duration-500 hover:-translate-y-4">
                <div class="relative h-[450px] w-full rounded-[2.8rem] overflow-hidden mb-8 shadow-inner">
                    <img src="${p.img}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <button onclick="addToCart(${p.id})" class="absolute bottom-6 right-6 bg-[#1A1A1A] text-[#D4AF37] w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-[#D4AF37] hover:text-white group/btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 transition-transform group-hover/btn:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v12m6-6H6" />
                        </svg>
                    </button>
                </div>
                
                <div class="px-4 pb-4">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-extrabold text-2xl tracking-tight leading-none">${p.name}</h3>
                        <span class="text-[#D4AF37] font-black text-xl whitespace-nowrap">${p.price.toLocaleString()} FCFA</span>
                    </div>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium pr-10">${p.desc}</p>
                </div>
            </div>
        `;
    });
}

window.addToCart = (id) => {
    const p = products.find(x => x.id === id);
    cart.push(p);
    
    const count = document.getElementById('cart-count');
    count.innerText = cart.length;
    count.classList.add('scale-125');
    setTimeout(() => count.classList.remove('scale-125'), 200);

    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('total-price').innerText = `${total.toLocaleString()} FCFA`;
    
    document.getElementById('checkout-bar').classList.remove('translate-y-[200%]');
};

window.filter = (cat, btn) => {
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.className = "cat-btn bg-white text-gray-400 border border-gray-100 px-8 py-4 rounded-[1.8rem] text-sm font-bold whitespace-nowrap hover:bg-gray-50 transition-all";
    });
    btn.className = "cat-btn bg-[#1A1A1A] text-white px-8 py-4 rounded-[1.8rem] text-sm font-bold shadow-2xl shadow-black/20 whitespace-nowrap transition-all";
    render(cat);
};

window.sendOrder = () => {
    const phone = "22177XXXXXXX"; 
    const total = cart.reduce((s, i) => s + i.price, 0);
    let items = cart.map(i => `- ${i.name}`).join('%0A');
    window.open(`https://wa.me/${phone}?text=Bonjour Nugelma, voici ma commande d'exception :%0A${items}%0A%0A*Total: ${total} FCFA*`, '_blank');
};

render();
