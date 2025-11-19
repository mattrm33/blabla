/* === PRODUITS INITIAUX === */
let PRODUCTS = [
  { name:"Nike Phantom III Elite", cat:"nike", price:80, images:["https://i.imgur.com/m6qs6pT.jpeg","https://i.imgur.com/m6qs6pT2.jpeg"] },
  { name:"Adidas Predator Elite", cat:"adidas", price:80, images:["https://i.imgur.com/IRlkw8v.jpeg"] },
  { name:"Adidas Copa Pure III", cat:"adidas", price:80, images:["https://i.imgur.com/0N1uYRv.jpeg","https://i.imgur.com/0N1uYRv2.jpeg"] },
  { name:"New Balance Tekela", cat:"newbalance", price:80, images:["https://i.imgur.com/ILgrgIQ.jpeg"] }
];

/* ELEMENTS HTML */
const productContainer = document.getElementById("products");

/* === RENDER PRODUITS === */
function renderProducts(filter="all") {
  productContainer.innerHTML = "";
  PRODUCTS.filter(p => filter==="all" || p.cat===filter).forEach((p,index)=>{
    const card=document.createElement("div"); card.classList.add("card");

    // CAROUSEL
    const carousel=document.createElement("div"); carousel.classList.add("carousel");
    p.images.forEach((imgUrl,i)=>{
      const img=document.createElement("img"); img.src=imgUrl;
      if(i===0) img.classList.add("active");
      carousel.appendChild(img);
    });

    // BODY
    const body=document.createElement("div"); body.classList.add("card-body");
    const title=document.createElement("h3"); title.textContent=p.name;
    const price=document.createElement("p"); price.classList.add("price"); price.textContent=`${p.price}€`;
    const colors=document.createElement("p"); colors.classList.add("stock"); colors.textContent=`Coloris: ${p.images.length}`;

    // QUANTITY + COMMANDER
    const qtyInput=document.createElement("input"); qtyInput.type="number"; qtyInput.min=1; qtyInput.value=1;
    const orderBtn=document.createElement("button"); orderBtn.textContent="Commander";
    orderBtn.onclick=()=>{
      const qty=qtyInput.value;
      const msg=`Bonjour, je voudrais commander ${qty} paire(s) de ${p.name}.`;
      navigator.clipboard.writeText(msg).then(()=>{
        window.location.href="instagram://user?username=cramponsdirect";
        alert("Message prêt ! Collez-le dans le DM Instagram de @cramponsdirect.");
      });
    };

    body.append(title, price, colors, qtyInput, orderBtn);
    card.append(carousel, body);
    productContainer.appendChild(card);

    startCarousel(carousel);
    card.onclick=(e)=>{
      if(!e.target.closest("button") && !e.target.closest("input")) openProductPage(p);
    };
  });
}

/* === CAROUSEL === */
function startCarousel(carousel){
  const imgs=carousel.querySelectorAll("img"); let current=0;
  setInterval(()=>{
    imgs[current].classList.remove("active");
    current=(current+1)%imgs.length;
    imgs[current].classList.add("active");
  },2000);
}

renderProducts();

/* === NAV CATEGORIES === */
document.querySelectorAll("nav li").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  });
});

/* === ADMIN LOGIN === */
const adminBtn=document.getElementById("adminBtn");
const loginModal=document.getElementById("loginModal");
const loginSubmit=document.getElementById("loginSubmit");
const loginError=document.getElementById("loginError");
const adminPanel=document.getElementById("adminPanel");
const adminMsg=document.getElementById("adminMsg");

adminBtn.onclick=()=>loginModal.style.display="flex";
document.querySelector(".close").onclick=()=>loginModal.style.display="none";

loginSubmit.onclick=()=>{
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  if(user==="admin" && pass==="1234"){
    loginError.textContent="Connexion réussie ✔"; loginError.style.color="green";
    setTimeout(()=>{ loginModal.style.display="none"; adminPanel.style.display="flex"; },800);
  } else { loginError.textContent="Identifiants incorrects ❌"; loginError.style.color="red"; }
};

/* === ADMIN PANEL === */
document.querySelector(".close-admin").onclick=()=>adminPanel.style.display="none";
document.getElementById("saveProduct").onclick=()=>{
  const name=document.getElementById("prodName").value.trim();
  const cat=document.getElementById("prodCat").value.trim().toLowerCase();
  const price=parseFloat(document.getElementById("prodPrice").value);
  const images=document.getElementById("prodImages").value.split(",").map(u=>u.trim()).filter(Boolean);

  if(!name||!cat||!price||images.length===0){ adminMsg.textContent="Tous les champs sont obligatoires !"; adminMsg.style.color="red"; return; }

  PRODUCTS.push({name,cat,price,images});
  adminMsg.textContent="Produit ajouté ✔"; adminMsg.style.color="green";

  document.getElementById("prodName").value="";
  document.getElementById("prodCat").value="";
  document.getElementById("prodPrice").value="";
  document.getElementById("prodImages").value="";

  renderProducts();
};

/* === PAGE PRODUIT === */
const productPage=document.getElementById("productPage");
const productDetail=document.getElementById("productDetail");
document.querySelector(".close-product").onclick=()=>productPage.style.display="none";

function openProductPage(product){
  productDetail.innerHTML="";
  const title=document.createElement("h2"); title.textContent=product.name;
  const carousel=document.createElement("div"); carousel.classList.add("carousel");
  product.images.forEach((imgUrl,i)=>{
    const img=document.createElement("img"); img.src=imgUrl;
    if(i===0) img.classList.add("active");
    carousel.appendChild(img);
  });

  const price=document.createElement("p"); price.classList.add("price"); price.textContent=`${product.price}€`;
  const colors=document.createElement("p"); colors.textContent="Sélectionnez le coloris:";

  const colorBtns=document.createElement("div"); colorBtns.style.display="flex"; colorBtns.style.gap="10px";
  product.images.forEach((imgUrl,i)=>{
    const btn=document.createElement("button"); btn.textContent=`Coloris ${i+1}`;
    btn.style.padding="5px 10px"; btn.style.cursor="pointer";
    btn.onclick=()=>carousel.querySelectorAll("img").forEach(img=>img.classList.remove("active")) || carousel.querySelectorAll("img")[i].classList.add("active");
    colorBtns.appendChild(btn);
  });

  const qtyInput=document.createElement("input"); qtyInput.type="number"; qtyInput.min=1; qtyInput.value=1;
  const orderBtn=document.createElement("button"); orderBtn.textContent="Commander";
  orderBtn.onclick=()=>{
    const qty=qtyInput.value;
    const msg=`Bonjour, je voudrais commander ${qty} paire(s) de ${product.name}.`;
    navigator.clipboard.writeText(msg).then(()=>{ window.location.href="instagram://user?username=cramponsdirect"; alert("Message prêt ! Collez-le dans le DM Instagram."); });
  };

  productDetail.append(title, carousel, price, colors, colorBtns, qtyInput, orderBtn);
  productPage.style.display="flex";
  startCarousel(carousel);
}

