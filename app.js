// PRODUITS
let PRODUCTS = [
  {name:"Nike Phantom III Elite",cat:"nike",price:80,images:["https://i.imgur.com/m6qs6pT.jpeg"]},
  {name:"Adidas Predator Elite",cat:"adidas",price:80,images:["https://i.imgur.com/IRlkw8v.jpeg"]},
  {name:"Adidas Copa Pure III",cat:"adidas",price:80,images:["https://i.imgur.com/0N1uYRv.jpeg"]},
  {name:"New Balance Tekela",cat:"newbalance",price:80,images:["https://i.imgur.com/ILgrgIQ.jpeg"]}
];

// ELEMENTS
const productContainer=document.getElementById("products");
const loginModal=document.getElementById("loginModal");
const loginSubmit=document.getElementById("loginSubmit");
const loginError=document.getElementById("loginError");
const adminBtn=document.getElementById("adminBtn");
const panelBtn=document.getElementById("panelBtn");
const adminPanel=document.getElementById("adminPanel");
const logTableBody=document.querySelector("#logTable tbody");
const cookiePopup=document.getElementById("cookiePopup");
const acceptCookies=document.getElementById("acceptCookies");
const refuseCookies=document.getElementById("refuseCookies");
const policyLink=document.getElementById("policyLink");
const policyModal=document.getElementById("policyModal");

// COOKIE LOGIC
if(!localStorage.getItem("cookiesAccepted")) cookiePopup.style.display="flex";
else initSite();

acceptCookies.onclick=()=>{
  localStorage.setItem("cookiesAccepted","true");
  cookiePopup.style.display="none";
  initSite();
};

refuseCookies.onclick=()=>{
  alert("Vous devez accepter les cookies pour accéder au site.");
  window.close();
};

policyLink.onclick=(e)=>{ e.preventDefault(); policyModal.style.display="flex"; };
document.querySelector(".close-policy").onclick=()=>policyModal.style.display="none";

// INIT SITE
function initSite(){
  renderProducts();
  logVisitor();
}

// RENDER PRODUITS
function renderProducts(filter="all"){
  productContainer.innerHTML="";
  PRODUCTS.filter(p=>filter==="all"||p.cat===filter).forEach((p)=>{
    const card=document.createElement("div"); card.classList.add("card");
    const img=document.createElement("img"); img.src=p.images[0];
    const body=document.createElement("div"); body.classList.add("card-body");
    const h3=document.createElement("h3"); h3.textContent=p.name;
    const price=document.createElement("p"); price.textContent=`${p.price}€`;
    const btn=document.createElement("button"); btn.textContent="Commander";
    btn.onclick=()=>{
      const msg=`Bonjour, je voudrais commander 1 paire de ${p.name}.`;
      navigator.clipboard.writeText(msg).then(()=>{ window.location.href="instagram://user?username=cramponsdirect"; alert("Message prêt ! Collez-le dans le DM Instagram."); });
    };
    body.append(h3,price,btn); card.append(img,body); productContainer.appendChild(card);
  });
}

// NAV CATEGORIES
document.querySelectorAll("nav li").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active"); renderProducts(btn.dataset.cat);
  }
});

// ADMIN LOGIN
adminBtn.onclick=()=>loginModal.style.display="flex";
document.querySelector(".close").onclick=()=>loginModal.style.display="none";

loginSubmit.onclick=async()=>{
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  const res=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user,pass})});
  const data=await res.json();
  if(data.success){ loginError.textContent="Connexion réussie ✔"; loginError.style.color="green"; localStorage.setItem("adminJWT",data.token); loginModal.style.display="none"; panelBtn.style.display="inline-block"; }
  else { loginError.textContent="Identifiants incorrects ❌"; loginError.style.color="red"; }
};

// PANEL ADMIN
panelBtn.onclick=()=>{ adminPanel.style.display="flex"; renderLogs(); };
document.querySelector(".close-admin").onclick=()=>adminPanel.style.display="none";

async function renderLogs(){
  const token=localStorage.getItem("adminJWT");
  if(!token) return;
  const res=await fetch("/api/logs",{headers:{Authorization:`Bearer ${token}`}});
  const logs=await res.json();
  logTableBody.innerHTML="";
  logs.forEach(log=>{
    const tr=document.createElement("tr");
    const ipTd=document.createElement("td"); ipTd.textContent=log.banned?"BANNED":log.ip;
    const deviceTd=document.createElement("td"); deviceTd.textContent=log.device;
    const timeTd=document.createElement("td"); timeTd.textContent=log.time;
    const actionTd=document.createElement("td");
    const banBtn=document.createElement("button"); banBtn.textContent="Ban IP";
    banBtn.onclick=async()=>{
      await fetch("/api/ban",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({ip:log.ip})});
      renderLogs();
    };
    actionTd.appendChild(banBtn); tr.append(ipTd,deviceTd,timeTd,actionTd); logTableBody.appendChild(tr);
  });
}

// LOG VISITEUR
async function logVisitor(){
  const device= /Mobi|Android/i.test(navigator.userAgent)?"Mobile":(/Tablet/i.test(navigator.userAgent)?"Tablet":"PC");
  await fetch("/api/log",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({device})});
}


