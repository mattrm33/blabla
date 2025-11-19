const productContainer = document.getElementById("products");
const loginModal = document.getElementById("loginModal");
const loginSubmit = document.getElementById("loginSubmit");
const loginError = document.getElementById("loginError");
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const saveProduct = document.getElementById("saveProduct");
const adminMsg = document.getElementById("adminMsg");

// Fetch products
async function fetchProducts(){
  const res = await fetch("/api/products");
  const products = await res.json();
  renderProducts(products);
}

// Render products
function renderProducts(products){
  productContainer.innerHTML="";
  products.forEach(p=>{
    const card=document.createElement("div"); card.classList.add("card");
    const img=document.createElement("img"); img.src=p.images[0];
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
    body.append(h3, price, btn);
    card.append(img,body);
    productContainer.appendChild(card);
  });
}

// Admin
adminBtn.onclick=()=>loginModal.style.display="flex";
document.querySelector(".close").onclick=()=>loginModal.style.display="none";
document.querySelector(".close-admin").onclick=()=>adminPanel.style.display="none";

loginSubmit.onclick=async()=>{
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  // Simple verification client-side (pour démo)
  const valid = ["admin1","admin2","admin3"].includes(user) && pass==="1234";
  if(valid){
    loginError.textContent="Connexion réussie ✔";
    loginError.style.color="green";
    setTimeout(()=>{ loginModal.style.display="none"; adminPanel.style.display="flex"; },500);
  } else { loginError.textContent="Identifiants incorrects ❌"; loginError.style.color="red"; }
};

saveProduct.onclick=async()=>{
  const name=document.getElementById("prodName").value;
  const cat=document.getElementById("prodCat").value;
  const price=parseFloat(document.getElementById("prodPrice").value);
  const images=document.getElementById("prodImages").value.split(",").map(u=>u.trim());
  if(!name||!cat||!price||images.length===0){ adminMsg.textContent="Tous les champs obligatoires !"; return; }
  const res = await fetch("/api/products",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "user":"admin1",
      "pass":"1234"
    },
    body: JSON.stringify({name,cat,price,images})
  });
  const data = await res.json();
  if(data.error){ adminMsg.textContent=data.error; } else { adminMsg.textContent="Produit ajouté ✔"; fetchProducts(); }
};

fetchProducts();
