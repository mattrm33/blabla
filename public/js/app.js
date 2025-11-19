/* ================= PRODUITS ================= */
const PRODUCTS = [
  { name:"Nike Phantom III Elite", cat:"nike", price:80, colors:["https://imgur.com/m6qs6pT.png","https://imgur.com/m6qs6pT.png"] },
  { name:"Adidas Predator Elite", cat:"adidas", price:80, colors:["https://imgur.com/IRlkw8v.png","https://imgur.com/IRlkw8v.png"] },
  { name:"Adidas Copa Pure III", cat:"adidas", price:80, colors:["https://imgur.com/0N1uYRv.png"] },
  { name:"New Balance Tekela", cat:"newbalance", price:80, colors:["https://imgur.com/ILgrgIQ.png"] }
];

/* ================= AFFICHAGE PRODUITS ================= */
const productContainer = document.getElementById("products");
function renderProducts(filter="all"){
  productContainer.innerHTML="";
  PRODUCTS.filter(p=>filter==="all"||p.cat===filter).forEach((p,idx)=>{
    let imgs = p.colors.map((url,i)=>`<img src="${url}" class="slide ${i===0?'active':''}">`).join("");
    productContainer.innerHTML+=`
      <div class="card">
        <div class="slider" id="slider-${idx}">${imgs}</div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="price">${p.price}€</p>
          <p class="colors-count">Couleurs: ${p.colors.length}</p>
          <button class="orderBtn" data-name="${p.name}">Commander</button>
        </div>
      </div>`;
    startSlider(`slider-${idx}`);
  });
  document.querySelectorAll(".orderBtn").forEach(btn=>{
    btn.onclick=()=>{ window.open("https://www.instagram.com/cramponsdirect/","_blank"); };
  });
}
function startSlider(sliderId){
  const slider=document.getElementById(sliderId);
  if(!slider)return;
  const slides=slider.querySelectorAll(".slide");
  if(slides.length<=1)return;
  let index=0;
  setInterval(()=>{
    slides[index].classList.remove("active");
    index=(index+1)%slides.length;
    slides[index].classList.add("active");
  },2500);
}
document.querySelectorAll("nav li").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  }
});
renderProducts();

/* ================= COOKIES ================= */
const cookieModal=document.getElementById("cookieModal");
const acceptCookies=document.getElementById("acceptCookies");
const refuseCookies=document.getElementById("refuseCookies");
window.onload=()=>{ if(!localStorage.getItem("cookiesAccepted")) cookieModal.style.display="flex"; };
acceptCookies.onclick=()=>{ localStorage.setItem("cookiesAccepted","true"); cookieModal.style.display="none"; };
refuseCookies.onclick=()=>{ alert("Vous devez accepter les cookies pour naviguer."); window.close(); };

/* ================= ADMIN ================= */
const adminBtn=document.getElementById("adminBtn");
const loginModal=document.getElementById("loginModal");
const loginSubmit=document.getElementById("loginSubmit");
const loginError=document.getElementById("loginError");
const adminPanelBtn=document.getElementById("adminPanelBtn");
const adminPanel=document.getElementById("adminPanel");
const closePanel=document.querySelector(".closePanel");
const visitorsTable=document.querySelector("#visitorsTable tbody");
const totalVisitors=document.getElementById("totalVisitors");
const totalOrders=document.getElementById("totalOrders");
const refreshLogsBtn=document.getElementById("refreshLogs");
const clearLogsBtn=document.getElementById("clearLogs");

adminBtn.onclick=()=>loginModal.style.display="flex";
document.querySelector(".close").onclick=()=>loginModal.style.display="none";

loginSubmit.onclick=async()=>{
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  try{
    const res=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user,pass})});
    const data=await res.json();
    if(data.success){ loginError.textContent="Connexion réussie ✔"; loginError.style.color="green"; setTimeout(()=>{ loginModal.style.display="none"; adminPanelBtn.style.display="block"; },800); fetchLogs(); }
    else{ loginError.textContent="Identifiants incorrects ❌"; loginError.style.color="red"; }
  }catch(err){ loginError.textContent="Erreur serveur ❌"; loginError.style.color="red"; }
};

adminPanelBtn.onclick=()=>adminPanel.style.display="flex";
closePanel.onclick=()=>adminPanel.style.display="none";

async function fetchLogs(){
  const res=await fetch("/api/logs");
  const data=await res.json();
  visitorsTable.innerHTML="";
  data.logs.forEach(log=>{
    const row=document.createElement("tr");
    row.innerHTML=`<td>${log.ip}</td><td>${log.user_agent}</td><td>${new Date(log.timestamp).toLocaleString()}</td><td><button class="banBtn" data-ip="${log.ip}">Ban</button></td>`;
    visitorsTable.appendChild(row);
  });
  totalVisitors.textContent=data.logs.length;
  totalOrders.textContent=data.orders||0;
  document.querySelectorAll(".banBtn").forEach(btn=>btn.onclick=()=>banIP(btn.dataset.ip));
}
async function banIP(ip){ if(!confirm(`Voulez-vous vraiment bannir ${ip} ?`)) return; await fetch("/api/ban",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ip})}); fetchLogs(); }
refreshLogsBtn.onclick=fetchLogs;
clearLogsBtn.onclick=async()=>{ if(!confirm("Voulez-vous vraiment supprimer tous les logs ?")) return; await fetch("/api/logs",{method:"DELETE"}); fetchLogs(); }



