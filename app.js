/* PRODUITS INITIAUX */
let PRODUCTS = [
  {name:"Nike Phantom III Elite",cat:"nike",price:80,images:["https://i.imgur.com/dCFxN49.png","https://i.imgur.com/i0tVarJ.png","https://i.imgur.com/XKvhyVQ.png","https://i.imgur.com/o26Tm5D.png","https://i.imgur.com/fcX1NKQ.png","https://i.imgur.com/EDa6rAI.png","https://i.imgur.com/2LdtmUc.png","https://i.imgur.com/pU9EEs7.png","https://i.imgur.com/pU9EEs7.png","https://i.imgur.com/WQh2Sd2.png","https://i.imgur.com/WQh2Sd2.png","https://i.imgur.com/gPyG6lp.png"]},
  {name:"Adidas Predator Elite",cat:"adidas",price:80,images:["https://i.imgur.com/IRlkw8v.jpeg"]},
  {name:"Adidas Copa Pure III",cat:"adidas",price:80,images:["https://i.imgur.com/0N1uYRv.jpeg"]},
  {name:"New Balance Tekela",cat:"newbalance",price:80,images:["https://i.imgur.com/ILgrgIQ.jpeg"]}
];

/* ELEMENTS */
const productContainer=document.getElementById("products");
const loginModal=document.getElementById("loginModal");
const loginSubmit=document.getElementById("loginSubmit");
const loginError=document.getElementById("loginError");
const adminBtn=document.getElementById("adminBtn");
const adminPanel=document.getElementById("adminPanel");
const saveProduct=document.getElementById("saveProduct");
const adminMsg=document.getElementById("adminMsg");

/* RENDER PRODUITS */
function renderProducts(filter="all"){
  productContainer.innerHTML="";
  PRODUCTS.filter(p=>filter==="all"||p.cat===filter).forEach((p,index)=>{
    const card=document.createElement("div"); card.classList.add("card");
    const img=document.createElement("img"); img.src=p.images[0];
    if(p.images.length>1){
      let i=0;
      setInterval(()=>{i=(i+1)%p.images.length; img.src=p.images[i];},3000);
    }
    const body=document.createElement("div"); body.classList.add("card-body");
    const h3=document.createElement("h3"); h3.textContent=p.name;
    const price=document.createElement("p"); price.textContent=`${p.price}€`;
    const btn=document.createElement("button"); btn.textContent="Commander";
    btn.onclick=()=>{
      const msg=`Bonjour, je voudrais commander 1 paire de ${p.name}.`;
      navigator.clipboard.writeText(msg).then(()=>{
        window.location.href="instagram://user?username=cramponsdirect";
        alert("Message prêt ! Collez-le dans le DM Instagram.");
      });
    };
    body.append(h3,price,btn);
    card.append(img,body);
    productContainer.appendChild(card);
  });
}
renderProducts();

/* NAVIGATION CATEGORIES */
document.querySelectorAll("nav li").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  }
});

/* ADMIN LOGIN */
adminBtn.onclick=()=>loginModal.style.display="flex";
document.querySelector(".close").onclick=()=>loginModal.style.display="none";
document.querySelector(".close-admin").onclick=()=>adminPanel.style.display="none";

loginSubmit.onclick=()=>{
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  if(["admin1","admin2","admin3"].includes(user) && pass==="1234"){
    loginError.textContent="Connexion réussie ✔"; loginError.style.color="green";
    setTimeout(()=>{ loginModal.style.display="none"; adminPanel.style.display="flex"; },500);
  }else{ loginError.textContent="Identifiants incorrects ❌"; loginError.style.color="red";}
};

/* AJOUT PRODUIT ADMIN */
saveProduct.onclick=()=>{
  const name=document.getElementById("prodName").value;
  const cat=document.getElementById("prodCat").value;
  const price=parseFloat(document.getElementById("prodPrice").value);
  const images=document.getElementById("prodImages").value.split(",").map(u=>u.trim());
  if(!name||!cat||!price||images.length===0){ adminMsg.textContent="Tous les champs obligatoires !"; return; }
  PRODUCTS.push({name,cat,price,images});
  adminMsg.textContent="Produit ajouté ✔";
  document.getElementById("prodName").value="";
  document.getElementById("prodCat").value="";
  document.getElementById("prodPrice").value="";
  document.getElementById("prodImages").value="";
  renderProducts();
};



