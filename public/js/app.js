const adminPanelBtn = document.getElementById("adminPanelBtn");
const adminPanel = document.getElementById("adminPanel");
const closePanel = document.querySelector(".closePanel");
const visitorsTable = document.querySelector("#visitorsTable tbody");
const totalVisitors = document.getElementById("totalVisitors");
const totalOrders = document.getElementById("totalOrders");
const refreshLogsBtn = document.getElementById("refreshLogs");
const clearLogsBtn = document.getElementById("clearLogs");

adminPanelBtn.onclick = () => { adminPanel.style.display = "flex"; };
closePanel.onclick = () => { adminPanel.style.display = "none"; };

async function fetchLogs() {
  const res = await fetch("/api/logs");
  const data = await res.json();
  visitorsTable.innerHTML = "";
  data.logs.forEach(log => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.ip}</td>
      <td>${log.user_agent}</td>
      <td>${new Date(log.timestamp).toLocaleString()}</td>
      <td><button class="banBtn" data-ip="${log.ip}">Ban</button></td>
    `;
    visitorsTable.appendChild(row);
  });
  totalVisitors.textContent = data.logs.length;
  totalOrders.textContent = data.orders || 0;
  document.querySelectorAll(".banBtn").forEach(btn => {
    btn.onclick = () => banIP(btn.dataset.ip);
  });
}

async function banIP(ip) {
  if (!confirm(`Voulez-vous vraiment bannir ${ip} ?`)) return;
  await fetch("/api/ban", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip })
  });
  fetchLogs();
}

refreshLogsBtn.onclick = fetchLogs;
clearLogsBtn.onclick = async () => {
  if (!confirm("Voulez-vous vraiment supprimer tous les logs ?")) return;
  await fetch("/api/logs", { method: "DELETE" });
  fetchLogs();
};


