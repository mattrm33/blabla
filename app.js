const PRODUCTS = [
  {id:'nike-1',brand:'nike',name:'Phantom GX2',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Contrôle extrême, semelle ultra réactive.'},
  {id:'nike-2',brand:'nike',name:'Phantom GX3',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Précision et confort.'},
  {id:'nike-3',brand:'nike',name:'Mercurial GX3 Elite',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Vitesse et légèreté.'},
  {id:'nike-4',brand:'nike',name:'Phantom Luna Elite',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Toucher de balle premium.'},
  {id:'adidas-1',brand:'adidas',name:'Predator Elite',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Adhérence et puissance.'},
  {id:'adidas-2',brand:'adidas',name:'F50',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Vitesse et contrôle.'},
  {id:'adidas-3',brand:'adidas',name:'Copa Pure II',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Confort et touche de balle.'},
  {id:'nb-1',brand:'newbalance',name:'Tekela',price:80,img:'https://i.imgur.com/XXXXXXX.png',desc:'Légèreté et traction dynamique.'}
];

const grid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

// render products
function renderProducts(brand='all'){
  document.body.classList.remove('cat-nike','cat-adidas','cat-newbalance');
  if(brand!=='all') document.body.classList.add(`cat-${brand}`);

  const filtered = brand==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.brand===brand);
  grid.innerHTML = filtered.map(p=>`
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <div class="product-brand">${capitalize(p.brand)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price}€</div>
        <button class="order-btn" onclick="showProduct('${p.id}')">Voir les détails</button>
      </div>
    </div>
  `).join('');
}

// modal functions
function showProduct(id){
  const product = PRODUCTS.find(p=>p.id===id);
  if(!product) return;
  const modal = document.getElementById('productModal');
  const details = document.getElementById('productDetails');
  details.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.img}" style="max-width:100%;margin:10px 0;">
    <p>${product.desc}</p>
    <p><strong>Prix:</strong> ${product.price}€</p>
    <label>Quantité: <input id="qty" type="number" value="1" min="1" max="10"></label>
    <button onclick="orderViaInstagram('${product.name}',${product.price})">Commander via Instagram</button>
  `;
  modal.style.display='flex';
}
function closeProduct(){ document.getElementById('productModal').style.display='none'; }

function orderViaInstagram(name,price){
  const qty = parseInt(document.getElementById('qty').value||1,10);
  const total = (price*qty).toFixed(2);
  const msg = `Bonjour, je souhaite commander :\n- ${name} x${qty} → ${total}€\n\nNom : \nTéléphone : \nAdresse (optionnel) :\n\nMerci !`;
  navigator.clipboard.writeText(msg).then(()=>{
    alert('Message copié ✅ Ouvrir Instagram...');
    window.open('https://www.instagram.com/cramponsdirect/','_blank');
  }).catch(()=>alert('Copie impossible. Message à envoyer :\n\n'+msg));
}

// filter buttons
filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.brand);
  });
});

// capitalize helper
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

// initial render
renderProducts('all');

renderProducts('nike');
