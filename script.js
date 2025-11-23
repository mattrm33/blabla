// Année dynamique
document.getElementById('year').textContent = new Date().getFullYear();

// Produits
const PRODUCTS = [
  {id:'nike-1', brand:'nike', name:'Phantom GX2', price:80, img:'https://i.imgur.com/XXXXXXX.png', desc:'Contrôle extrême, semelle ultra réactive.'},
  {id:'nike-2', brand:'nike', name:'Phantom GX3', price:80, img:'https://i.imgur.com/XXXXXXX.png', desc:'Précision et confort.'},
  {id:'adidas-1', brand:'adidas', name:'Predator Elite', price:80, img:'https://i.imgur.com/XXXXXXX.png', desc:'Adhérence et puissance.'},
  {id:'adidas-2', brand:'adidas', name:'Copa Pure II', price:80, img:'https://i.imgur.com/XXXXXXX.png', desc:'Confort et toucher de balle.'},
  {id:'nb-1', brand:'newbalance', name:'Tekela', price:80, img:'https://i.imgur.com/XXXXXXX.png', desc:'Légèreté et traction dynamique.'},
];

// Render produits
const grid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderProducts(brand='all'){
  const filtered = brand==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.brand===brand);
  grid.innerHTML = filtered.map(p=>`
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price}€</div>
        <button class="order-btn" onclick="orderViaInstagram('${p.name}',${p.price})">Commander via Instagram</button>
      </div>
    </div>
  `).join('');
}

// Filtrage
filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.brand);
  });
});

// Commande Instagram
function orderViaInstagram(name, price){
  const qty = 1;
  const total = (price*qty).toFixed(2);
  const msg = `Bonjour, je souhaite commander :\n- ${name} x${qty} → ${total}€\n\nNom : \nTéléphone : \nAdresse :\n\nMerci !`;
  navigator.clipboard.writeText(msg).then(()=>{
    window.open('https://www.instagram.com/cramponsdirect/','_blank');
  }).catch(()=>alert(msg));
}

// Initial render
renderProducts('all');

