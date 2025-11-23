/* app.js - product rendering, interactions, tilt & instagram order */

const PRODUCTS = [
  { id:'nike-1', name:'Nike Phantom III Elite', brand:'nike', price:80, stock:10,
    image:'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f6b00c2d-fc96-421b-a4d7-2a34429f8d28/phantom-gx-ii-elite-fg-football-boot-bStMCx.png',
    description:'Contrôle extrême, semelle ultra réactive.' },
  { id:'adidas-1', name:'Adidas Predator Elite', brand:'adidas', price:80, stock:5,
    image:'https://assets.adidas.com/images/w_600,f_auto,q_auto/0c36ecc23c304e3eb33caca701403824_9366/Predator_Elite_FG_Black_IE1804_01_standard.jpg',
    description:'Adhérence et puissance sur tous terrains.' },
  { id:'adidas-2', name:'Adidas Copa Pure III', brand:'adidas', price:80, stock:5,
    image:'https://assets.adidas.com/images/w_600,f_auto,q_auto/1d529c9cb3c444edbde6050531b203c2_9366/Copa_Pure_III_FG_Black_GW4968_01_standard.jpg',
    description:'Touche de balle traditionnelle et confort.' },
  { id:'nb-1', name:'New Balance Tekela', brand:'newbalance', price:80, stock:6,
    image:'https://nb.scene7.com/is/image/NB/msplsfd4_nb_02_i?$pdpflexf2$',
    description:'Légèreté et traction dynamique.' }
];

const grid = document.getElementById('productsGrid');
const catBtns = document.querySelectorAll('.cat-btn');
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

// render products for a category
function renderProducts(brand='nike'){
  // update body class to change background pattern
  document.body.classList.remove('cat-nike','cat-adidas','cat-newbalance');
  document.body.classList.add(`cat-${brand}`);

  // active button state
  catBtns.forEach(b => b.classList.toggle('active', b.dataset.cat === brand));

  const html = PRODUCTS.filter(p => p.brand === brand)
    .map(p => productCard(p)).join('');
  grid.innerHTML = html;
  attachCardListeners();
}

// product card html
function productCard(p){
  return `
    <article class="card" data-id="${p.id}">
      <div class="media">
        <img class="photo" src="${p.image}" alt="${escapeHtml(p.name)}" />
      </div>

      <div class="meta">
        <div>
          <div class="title">${escapeHtml(p.name)}</div>
          <div class="brand small">${capitalize(p.brand)}</div>
        </div>
        <div class="price">${p.price.toFixed(2)}€</div>
      </div>

      <p class="small" style="margin-top:10px;color:var(--muted)">${escapeHtml(p.description)}</p>

      <div class="card-footer">
        <div class="small">${p.stock} en stock</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline" data-action="view" data-id="${p.id}">Voir</button>
          <button class="btn btn-primary" data-action="order" data-id="${p.id}">Commander</button>
        </div>
      </div>
    </article>
  `;
}

// attach tilt & button listeners
function attachCardListeners(){
  document.querySelectorAll('.card').forEach(card => {
    const photo = card.querySelector('.photo');

    // mouse move tilt
    const onMove = e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (-dy / rect.height) * 8;
      const ry = (dx / rect.width) * 10;
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
    };

    const onEnter = () => {
      card.classList.add('is-hover');
      card.addEventListener('mousemove', onMove);
    };
    const onLeave = () => {
      card.classList.remove('is-hover');
      card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg');
      card.removeEventListener('mousemove', onMove);
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    // action buttons
    card.querySelectorAll('[data-action]').forEach(btn => {
      btn.onclick = (ev) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const product = PRODUCTS.find(p=>p.id===id);
        if(action === 'view') quickView(product);
        if(action === 'order') orderFlow(product);
      };
    });
  });
}

// quick view modal
function quickView(product){
  const o = document.createElement('div');
  o.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:120;padding:18px';
  o.innerHTML = `
    <div style="background:#fff;border-radius:14px;padding:18px;max-width:900px;width:100%;box-shadow:var(--shadow);color:#111">
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <div style="flex:0 0 420px;border-radius:10px;overflow:hidden;background:#fafafa;padding:18px;display:flex;align-items:center;justify-content:center">
          <img src="${product.image}" style="max-width:100%;max-height:420px;object-fit:contain" alt="${escapeHtml(product.name)}" />
        </div>
        <div style="flex:1;min-width:220px">
          <h3 style="margin:0 0 8px">${escapeHtml(product.name)}</h3>
          <div style="color:var(--muted);margin-bottom:12px">${escapeHtml(product.description)}</div>
          <div style="font-weight:900;font-size:22px;margin-bottom:12px">${product.price.toFixed(2)}€</div>
          <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px">
            <label style="font-weight:700">Quantité</label>
            <input id="q" type="number" min="1" max="${product.stock}" value="1" style="width:80px;padding:8px;border-radius:8px;border:1px solid #ddd" />
          </div>
          <div style="display:flex;gap:10px">
            <button id="orderNow" class="btn btn-primary">Commander via Instagram</button>
            <button id="closeQV" class="btn btn-outline">Fermer</button>
          </div>
          <div style="margin-top:12px;color:var(--muted)">Stock : ${product.stock}</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(o);
  document.getElementById('closeQV').onclick = ()=> o.remove();
  document.getElementById('orderNow').onclick = ()=>{
    const qty = parseInt(document.getElementById('q').value || 1, 10);
    o.remove();
    orderViaInstagram(product, qty);
  };
}

// ordering flow: copies message and opens Instagram profile
function orderViaInstagram(product, qty=1){
  const total = (product.price * qty).toFixed(2);
  const plain = `Bonjour, je souhaite commander :\n- ${product.name} x${qty} → ${total}€\n\nNom : \nTéléphone : \nAdresse (optionnel) :\n\nMerci !`;
  copyText(plain).then(()=>{
    toast('Message copié ✅ — ouverture Instagram...');
    window.open('https://www.instagram.com/cramponsdirect/','_blank','noopener');
  }).catch(()=>{
    alert('Copie automatique impossible. Voici le message à envoyer :\n\n' + plain);
    window.open('https://www.instagram.com/cramponsdirect/','_blank','noopener');
  });
}

// small helpers
function copyText(txt){
  if(navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
  return new Promise((resolve,reject)=>{
    const ta = document.createElement('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.left='-9999px';
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); ta.remove(); resolve(); } catch(e){ ta.remove(); reject(e) }
  });
}
function toast(txt, ms=1500){
  const el = document.createElement('div'); el.textContent=txt;
  el.style = 'position:fixed;right:18px;bottom:18px;background:rgba(0,0,0,0.85);color:white;padding:10px 14px;border-radius:10px;font-weight:700;z-index:9999';
  document.body.appendChild(el); setTimeout(()=> el.style.opacity='0', ms-400); setTimeout(()=> el.remove(), ms);
}
function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1) }

// nav wiring
document.querySelectorAll('.cat-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    document.querySelectorAll('.cat-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    renderProducts(b.dataset.cat);
  });
});

// initial render
renderProducts('nike');
