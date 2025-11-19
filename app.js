// app.js (module)
const STORAGE_KEY = 'crampon_products_v1';
const CART_KEY = 'crampon_cart_v1';
const ADMIN_PASSWORD_HASH = btoa('herve regnier le goat'); // -> remplacer si besoin
const DEFAULT_LANG = localStorage.getItem('crampon_lang') || 'fr';

const i18n = {
  fr: {
    contact: 'Nous contacter',
    add: 'Ajouter',
    logout: 'Déconnexion',
    heroTitle: 'LES MEILLEURS CRAMPONS',
    heroSubtitle: 'Football • Rugby • Chaussettes Anti-Dérapantes',
    noProducts: 'Aucun produit pour le moment',
    addProduct: 'Ajouter un Produit',
    loginAdmin: 'Connexion Admin',
    incorrectCred: 'Identifiants incorrects',
    cart: 'Panier',
    checkout: 'Procéder au paiement',
    emptyCart: 'Panier vide',
    qty: 'Qté',
    remove: 'Supprimer',
    total: 'Total',
    simPayment: 'Payer (simulation)',
    productNotFound: '404 — Produit introuvable',
    backHome: 'Retour à l’accueil',
    lang: 'Langue'
  },
  en: {
    contact: 'Contact us',
    add: 'Add',
    logout: 'Sign out',
    heroTitle: 'THE BEST CLEATS',
    heroSubtitle: 'Football • Rugby • Anti-Slip Socks',
    noProducts: 'No products yet',
    addProduct: 'Add Product',
    loginAdmin: 'Admin Login',
    incorrectCred: 'Wrong credentials',
    cart: 'Cart',
    checkout: 'Checkout',
    emptyCart: 'Cart is empty',
    qty: 'Qty',
    remove: 'Remove',
    total: 'Total',
    simPayment: 'Pay (simulation)',
    productNotFound: '404 — Product not found',
    backHome: 'Back to home',
    lang: 'Language'
  }
};

let LANG = DEFAULT_LANG;
let APP = document.getElementById('app');

function t(k){ return (i18n[LANG] && i18n[LANG][k]) || i18n['fr'][k] }

function sampleProducts(){
  return [
    {id: 1, name: "Crampon Nitro X", category:'football', price:129.99, image:"https://images.unsplash.com/photo-1533850595622-7f364b8f1b2a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1", description:"Crampon ultra léger, parfait sur terrain sec."},
    {id: 2, name: "Rugby Power Pro", category:'rugby', price:149.00, image:"https://images.unsplash.com/photo-1558981403-c5f989a2f1d5?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2", description:"Adhérence et confort pour les rencontres intenses."},
    {id: 3, name: "Chaussettes Grip+", category:'chaussettes', price:19.90, image:"https://images.unsplash.com/photo-1598032894900-9f13f6f2f2a8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3", description:"Chaussettes anti-dérapantes, maintien renforcé."}
  ];
}

/* Storage helpers */
function loadProducts(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) {
      const sample = sampleProducts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch(e){ return [] }
}
function saveProducts(products){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/* Cart helpers */
function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch(e){return []}}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart))}

/* Router (hash-based) */
function router(){
  const hash = location.hash || '#/';
  if(hash.startsWith('#product-')){
    const id = Number(hash.split('-')[1]);
    renderProductDetail(id);
  } else if(hash === '#/admin') {
    renderHome(true);
  } else {
    renderHome();
  }
}

/* Render functions */
function render(){
  router();
  window.onhashchange = router;
}

function renderHeader(isAdmin=false){
  return `
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <div class="logo">CD</div>
        <div>
          <h1>CRAMPON DIRECT</h1>
          <div class="small">${t('heroSubtitle')}</div>
        </div>
      </div>

      <div class="header-actions">
        <select id="langSelect" class="input" style="width:120px;padding:6px;border-radius:10px">
          <option value="fr"${LANG==='fr'?' selected':''}>FR</option>
          <option value="en"${LANG==='en'?' selected':''}>EN</option>
        </select>

        <a class="btn" href="https://www.instagram.com/cramponsdirect/" target="_blank" rel="noreferrer">${t('contact')}</a>
        ${ isAdmin ? `<button id="btnAdd" class="btn small">${t('add')}</button>
                     <button id="btnLogout" class="btn small" style="background:var(--danger)">${t('logout')}</button>` 
                  : `<button id="btnLogin" class="btn small">${t('loginAdmin') || 'Admin'}</button>`}
      </div>
    </div>
  </header>`;
}

function renderHero(){
  return `
    <section class="hero">
      <h2>${t('heroTitle')}</h2>
      <p>${t('heroSubtitle')}</p>
    </section>
  `;
}

function getCategoryLabel(cat){
  return {football:'⚽ Football', rugby:'🏉 Rugby', chaussettes:'🧦 Chaussettes'}[cat] || cat;
}

function renderProductCard(p, isAdmin=false){
  return `
    <div class="card">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" />
      <div class="card-body">
        <div class="tag">${getCategoryLabel(p.category)}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description || '')}</p>
        <div class="row">
          <div style="font-weight:800">${p.price.toFixed(2)}€</div>
          <div style="display:flex;gap:8px">
            <button class="btn small" data-action="view" data-id="${p.id}">Voir</button>
            <button class="btn small" data-action="addtocart" data-id="${p.id}">+ Panier</button>
            ${isAdmin? `<button class="btn small" data-action="delete" data-id="${p.id}" style="background:var(--danger)">Suppr</button>`: ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHome(adminMode=false){
  const products = loadProducts();
  const isAdmin = sessionStorage.getItem('isAdmin') === '1' || adminMode;
  const grid = products.map(p => renderProductCard(p, isAdmin)).join('') || `<div class="notfound center"><p class="kicker">${t('noProducts')}</p></div>`;

  APP.innerHTML = `
    ${renderHeader(isAdmin)}
    ${renderHero()}
    <div class="container">
      <main>
        <div class="grid">${grid}</div>
      </main>
      <aside class="aside">
        ${renderCartPanel()}
        ${renderAdminPanel(isAdmin)}
      </aside>
    </div>
    <footer class="footer">© ${new Date().getFullYear()} Crampon Direct</footer>
    ${renderModals()}
  `;

  attachHomeListeners(isAdmin);
}

/* Product detail */
function renderProductDetail(id){
  const products = loadProducts();
  const p = products.find(x=>x.id===id);
  if(!p){
    APP.innerHTML = `${renderHeader()}<div class="notfound"><h2>${t('productNotFound')}</h2><p><a class="btn" href="#/"> ${t('backHome')} </a></p></div>`;
    return;
  }
  APP.innerHTML = `
    ${renderHeader(sessionStorage.getItem('isAdmin')==='1')}
    <section class="hero" style="text-align:left;max-width:1100px;margin:28px auto">
      <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:420px;height:320px;object-fit:cover;border-radius:12px;box-shadow:var(--shadow)" />
        <div style="flex:1">
          <div class="badge">${getCategoryLabel(p.category)}</div>
          <h2 style="margin:10px 0">${escapeHtml(p.name)}</h2>
          <p class="small">${escapeHtml(p.description || '')}</p>
          <div style="margin-top:18px;font-size:28px;font-weight:800">${p.price.toFixed(2)}€</div>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn" data-action="addtocart" data-id="${p.id}">${t('add')}</button>
            <a class="btn ghost" href="#/">${t('backHome')}</a>
          </div>
        </div>
      </div>
    </section>
    <div style="max-width:1100px;margin:20px auto">${renderCartPanel()}</div>
    ${renderModals()}
  `;

  attachDetailListeners();
}

/* Cart panel */
function renderCartPanel(){
  const cart = loadCart();
  const products = loadProducts();
  const lines = cart.map(item=>{
    const p = products.find(pr => pr.id === item.id) || {name:'??',price:0,image:''};
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}" />
      <div style="flex:1">
        <div style="font-weight:700">${escapeHtml(p.name)}</div>
        <div class="small">${item.qty} × ${p.price.toFixed(2)}€</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">${(item.qty*p.price).toFixed(2)}€</div>
        <button class="btn small" data-action="remove-from-cart" data-id="${item.id}">x</button>
      </div>
    </div>`;
  }).join('') || `<div class="small center" style="padding:12px">${t('emptyCart')}</div>`;

  const total = cart.reduce((acc,it)=>{
    const p = products.find(pr=>pr.id===it.id); return acc + (p? p.price*it.qty : 0);
  },0);

  return `<div class="panel">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${t('cart')}</strong></div>
      <div class="small">${t('total')}: <strong>${total.toFixed(2)}€</strong></div>
    </div>
    <div class="cart-items" id="cart-items">${lines}</div>
    <div style="margin-top:12px;display:flex;gap:8px">
      <button id="checkoutBtn" class="btn btn-block">${t('simPayment')}</button>
      <button id="clearCartBtn" class="btn ghost">${t('emptyCart')}</button>
    </div>
    <div style="margin-top:10px" class="small">⚠️ Simulation — Remplacez par Stripe Checkout côté serveur.</div>
  </div>`;
}

/* Admin quick panel */
function renderAdminPanel(isAdmin){
  return `<div style="height:12px"></div>`;
}

/* Modals html (login + add product) */
function renderModals(){
  return `
    <div id="modal-root"></div>
  `;
}

/* Attach listeners */
function attachHomeListeners(isAdmin){
  // lang select
  const langSelect = document.getElementById('langSelect');
  if(langSelect){ langSelect.onchange = (e)=>{ LANG = e.target.value; localStorage.setItem('crampon_lang', LANG); render() } }

  // buttons
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.onclick = (ev)=>{
      const action = btn.dataset.action;
      const id = Number(btn.dataset.id);
      if(action === 'view'){ location.hash = `#product-${id}` }
      else if(action === 'addtocart'){ addToCart(id); render(); }
      else if(action === 'delete' && isAdmin){ deleteProduct(id); render(); }
    };
  });

  const loginBtn = document.getElementById('btnLogin');
  if(loginBtn) loginBtn.onclick = showLoginModal;

  const btnAdd = document.getElementById('btnAdd');
  if(btnAdd) btnAdd.onclick = showAddProductModal;

  const btnLogout = document.getElementById('btnLogout');
  if(btnLogout) { btnLogout.onclick = ()=>{ sessionStorage.removeItem('isAdmin'); render(); } }

  // cart listener
  attachCartPanelListeners();
}

function attachDetailListeners(){
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.onclick = ()=>{
      const action = btn.dataset.action;
      const id = Number(btn.dataset.id);
      if(action === 'addtocart'){ addToCart(id); location.hash = '#/'; render(); }
    }
  });
  attachCartPanelListeners();
}

function attachCartPanelListeners(){
  const checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn) checkoutBtn.onclick = simulateCheckout;

  const clearCartBtn = document.getElementById('clearCartBtn');
  if(clearCartBtn) clearCartBtn.onclick = ()=>{ saveCart([]); render(); }

  document.querySelectorAll('[data-action="remove-from-cart"]').forEach(btn=>{
    btn.onclick = ()=>{ removeFromCart(Number(btn.dataset.id)); render(); }
  });
}

/* Cart operations */
function addToCart(id){
  const cart = loadCart();
  const exists = cart.find(c=>c.id===id);
  if(exists){ exists.qty+=1; } else { cart.push({id, qty:1}) }
  saveCart(cart);
  toast('✅ Produit ajouté au panier');
}

function removeFromCart(id){
  let cart = loadCart();
  cart = cart.filter(c=>c.id!==id);
  saveCart(cart);
  toast('✅ Supprimé du panier');
}

/* Admin: modals */
function showLoginModal(){
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="loginBackdrop">
      <div class="modal">
        <h3>${t('loginAdmin')}</h3>
        <div class="form-row"><input id="loginUser" class="input" placeholder="admin" /></div>
        <div class="form-row"><input id="loginPass" type="password" class="input" placeholder="password" /></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="doLogin" class="btn">${t('loginAdmin')}</button>
          <button id="closeLogin" class="btn ghost">Cancel</button>
        </div>
        <div id="loginError" class="small" style="color:var(--danger);margin-top:8px"></div>
      </div>
    </div>
  `;
  document.getElementById('closeLogin').onclick = ()=>{ modalRoot.innerHTML=''; };
  document.getElementById('doLogin').onclick = doLogin;
  document.getElementById('loginPass').onkeydown = (e)=>{ if(e.key==='Enter') doLogin() };
}

function doLogin(){
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  if(user === 'admin' && btoa(pass) === ADMIN_PASSWORD_HASH){
    sessionStorage.setItem('isAdmin','1');
    document.getElementById('modal-root').innerHTML = '';
    toast('🔐 Admin connecté');
    render();
  } else {
    err.innerText = t('incorrectCred');
  }
}

function showAddProductModal(){
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="addBackdrop">
      <div class="modal">
        <h3>${t('addProduct')}</h3>
        <div class="form-row"><input id="pname" class="input" placeholder="Nom du produit" /></div>
        <div class="form-row">
          <select id="pcat" class="input">
            <option value="football">⚽ Football</option>
            <option value="rugby">🏉 Rugby</option>
            <option value="chaussettes">🧦 Chaussettes</option>
          </select>
        </div>
        <div class="form-row"><input id="pprice" class="input" placeholder="Prix €" type="number" step="0.01" /></div>
        <div class="form-row"><textarea id="pdesc" class="input" placeholder="Description"></textarea></div>
        <div class="form-row">
          <div class="file-drop" id="fileDrop">Cliquez pour ajouter une image<input id="pfile" type="file" accept="image/*" style="display:none" /></div>
          <div id="preview" class="small" style="margin-top:6px"></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="saveProd" class="btn">${t('addProduct')}</button>
          <button id="closeProd" class="btn ghost">Cancel</button>
        </div>
        <div id="addError" class="small" style="color:var(--danger);margin-top:8px"></div>
      </div>
    </div>
  `;
  const fileDrop = document.getElementById('fileDrop');
  const fileInput = document.getElementById('pfile');
  fileDrop.onclick = ()=> fileInput.click();
  fileInput.onchange = (e)=> {
    const f = e.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = ()=> {
      document.getElementById('preview').innerHTML = `<img src="${r.result}" style="max-width:160px;border-radius:8px" />`;
      fileDrop.dataset.data = r.result;
    };
    r.readAsDataURL(f);
  };

  document.getElementById('closeProd').onclick = ()=>{ document.getElementById('modal-root').innerHTML = '' }
  document.getElementById('saveProd').onclick = ()=>{
    const name = document.getElementById('pname').value.trim();
    const cat = document.getElementById('pcat').value;
    const price = parseFloat(document.getElementById('pprice').value||0);
    const desc = document.getElementById('pdesc').value;
    const image = fileDrop.dataset.data || '';

    if(!name || !price || !image){
      document.getElementById('addError').innerText = 'Nom, prix et image requis';
      return;
    }
    const products = loadProducts();
    const prod = { id: Date.now(), name, category:cat, price, description:desc, image };
    products.push(prod); saveProducts(products);
    document.getElementById('modal-root').innerHTML = '';
    toast('✅ Produit ajouté');
    render();
  }
}

/* Delete product */
function deleteProduct(id){
  let products = loadProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  toast('Produit supprimé');
}

/* Checkout simulation */
function simulateCheckout(){
  const cart = loadCart();
  if(!cart.length){ toast('Panier vide'); return; }
  // Here we would call our server to create a Stripe Checkout session.
  // Because this demo is frontend-only we show a simulation.
  saveCart([]);
  toast('✓ Paiement simulé — Remplacez par Stripe Checkout dans ton backend');
  render();
}

/* Utilities */
function toast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position='fixed'; el.style.right='18px'; el.style.bottom='18px';
  el.style.background='rgba(0,0,0,0.8)'; el.style.color='white'; el.style.padding='10px 14px';
  el.style.borderRadius='10px'; el.style.zIndex=9999; el.style.fontWeight=700;
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity='0',1600);
  setTimeout(()=> el.remove(),2200);
}

function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])) }

/* initial render */
render();

/* listen for external events (cart links from detail for example) */
document.addEventListener('click', (ev)=>{
  if(ev.target.matches('[data-action="view"]')) {
    const id = Number(ev.target.dataset.id); location.hash = `#product-${id}`;
  }
});
