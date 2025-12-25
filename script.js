let data = JSON.parse(localStorage.getItem("easytrack") || "{}");
let currentTab = null;
let chart = null;

function save(){
  localStorage.setItem("easytrack", JSON.stringify(data));
}

function renderTabs(){
  const tabList = document.getElementById("tabList");
  tabList.innerHTML = "";
  Object.keys(data).forEach(name=>{
    const d = document.createElement("div");
    d.className = "tab";
    d.innerText = name;
    d.onclick = ()=>openTab(name);
    tabList.appendChild(d);
  });
}

function addTab(){
  const input = document.getElementById("newTabName");
  const name = input.value.trim();
  if(!name || data[name]) return;
  data[name] = [];
  save();
  renderTabs();
  input.value = "";
}

function openTab(name){
  currentTab = name;
  document.getElementById("home").classList.add("hidden");
  document.getElementById("tabView").classList.remove("hidden");
  document.getElementById("tabTitle").innerText = name;
  renderAll();
}

function goHome(){
  document.getElementById("tabView").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function addEntry(){
  const value = Number(document.getElementById("value").value);
  const unit = document.getElementById("unit").value;
  if(!value) return;

  data[currentTab].push({
    value,
    unit,
    time: new Date().toISOString()
  });

  save();
  document.getElementById("value").value = "";
  renderAll();
}

function renderAll(){
  renderEntries();
  renderChart();
  renderWeekly();
}

function renderEntries(){
  const entries = document.getElementById("entries");
  entries.innerHTML = "";

  data[currentTab].forEach(e=>{
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <input type="number" value="${e.value}" style="width:80px">
      <span>${e.unit} • ${new Date(e.time).toLocaleString()}</span>
      <button class="ghost">💾</button>
    `;
    d.querySelector("button").onclick = ()=>{
      e.value = Number(d.querySelector("input").value);
      save();
      renderAll();
    };
    entries.appendChild(d);
  });
}

function renderChart(){
  const ctx = document.getElementById("chart");
  if(chart) chart.destroy();

  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels:data[currentTab].map(e=>new Date(e.time).toLocaleTimeString()),
      datasets:[{
        label:"Progress",
        data:data[currentTab].map(e=>e.value),
        borderWidth:2
      }]
    }
  });
}

function renderWeekly(){
  let total = 0;
  const now = new Date();

  data[currentTab].forEach(e=>{
    const d = new Date(e.time);
    if((now - d) / 86400000 <= 7){
      total += e.value;
    }
  });

  document.getElementById("weekly").innerHTML =
    `<b>Total:</b> ${total}<br><b>Avg/day:</b> ${(total/7).toFixed(2)}`;
}

function openSettings(){
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

function closeSettings(){
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function toggleTheme(){
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "light" : "dark";
}

function enableNotif(){
  Notification.requestPermission();
}

renderTabs();
