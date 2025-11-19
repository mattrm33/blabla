/* === PRODUITS INITIAL === */
let PRODUCTS = [
  { name: "Nike Phantom III Elite", cat:"nike", price:80, images:["https://i.imgur.com/m6qs6pT.jpeg","https://i.imgur.com/m6qs6pT2.jpeg"] },
  { name: "Adidas Predator Elite", cat:"adidas", price:80, images:["https://i.imgur.com/IRlkw8v.jpeg"] },
  { name: "Adidas Copa Pure III", cat:"adidas", price:80, images:["https://i.imgur.com/0N1uYRv.jpeg","https://i.imgur.com/0N1uYRv2.jpeg"] },
  { name: "New Balance Tekela", cat:"newbalance", price:80, images:["https://i.imgur.com/ILgrgIQ.jpeg"] }
];

/* HTML Elements */
const productContainer = document.getElementById("products");

/* === RENDER PRODUITS === */
function renderProducts(filter="all") {
  productContainer.innerHTML = "";
  PRODUCTS.filter(p => filter==="all" || p.cat===filter).forEach((p,index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const carousel = document.createElement("div");
    carousel.classList.add("carousel");

    p.images.forEach((imgUrl,i)=>{
      const img = document.createElement("img");
      img.src = imgUrl;
      if(i===0) img.classList.add("active");
      carousel.appendChild(img);
    });

    const body = document.createElement("div");
    body.classList.add("card-body");

    const title = document.createElement("h3"); title.textContent=p.name;
    const price = document.createElement("p"); price.classList.add("price"); price.textContent=`${p.price}€`;
    const colors = document.createElement("p"); colors.classList.add("stock"); colors.textContent=`Coloris disponibles : ${p.images.length}`;

    // Input quantité
    const qtyInput = document.createElement("input");
    qtyInput.type="number"; qtyInput.min=1; qtyInput.value=1;

    // Bouton commander
    const orderBtn = document.createElement("button");
    orderBtn.textContent="Commander";
    orderBtn.onclick = ()=>{
      const qty = qtyInput.value;
      const msg = `Bonjour, je voudrais commander ${qty} paire(s) de ${p.name}.`;
      navigator.clipboard.writeText(msg).then(()=>{
        window.open("https://www.instagram.com/cramponsdirect/", "_blank");
        alert("Message copié dans le presse-papier ! Collez-le dans le DM Instagram.");
      });
    };

    body.append(title, price, colors, qtyInput, orderBtn);
    card.append(carousel, body);
    productContainer.appendChild(card);

    // Lancer le slider
    startCarousel(carousel);
  });
}

/* === CAROUSEL === */
function startCarousel(carousel){
  const imgs = carousel.querySelectorAll("img");
  let current = 0;
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
const adminBtn = document.getElementById("adminBtn");
const loginModal = document.getElementById("loginModal");
const loginSubmit = document.getElementById("loginSubmit");
const loginError = document.getElementById("loginError");
const adminPanel = document.getElementById("adminPanel");
const adminMsg = document.getElementById("adminMsg");

adminBtn.onclick = ()=>loginModal.style.display="flex";
document.querySelector(".close").onclick = ()=>loginModal.style.display="none";

loginSubmit.onclick = ()=>{
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  if(user==="admin" && pass==="1234"){
    loginError.textContent="Connexion réussie ✔";
    loginError.style.color="green";
    setTimeout(()=>{ loginModal.style.display="none"; adminPanel.style.display="flex"; },800);
  } else {
    loginError.textContent="Identifiants incorrects ❌";
    loginError.style.color="red";
  }
};

/* === ADMIN PANEL === */
document.querySelector(".close-admin").onclick = ()=>adminPanel.style.display="none";

document.getElementById("saveProduct").onclick = ()=>{
  const name=document.getElementById("prodName").value.trim();
  const cat=document.getElementById("prodCat").value.trim().toLowerCase();
  const price=parseFloat(document.getElementById("prodPrice").value);
  const images=document.getElementById("prodImages").value.split(",").map(url=>url.trim()).filter(Boolean);

  if(!name||!cat||!price||images.length===0){
    adminMsg.textContent="Tous les champs sont obligatoires !";
    adminMsg.style.color="red";
    return;
  }

  PRODUCTS.push({name,cat,price,images});
  adminMsg.textContent="Produit ajouté avec succès ✔";
  adminMsg.style.color="green";

  // Reset form
  document.getElementById("prodName").value="";
  document.getElementById("prodCat").value="";
  document.getElementById("prodPrice").value="";
  document.getElementById("prodImages").value="";

  renderProducts();
};
