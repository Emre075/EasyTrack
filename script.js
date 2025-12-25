let tabs = JSON.parse(localStorage.getItem("tabs")) || [];
let currentTab = null;

function save() {
  localStorage.setItem("tabs", JSON.stringify(tabs));
}

function renderTabs() {
  const container = document.getElementById("tabs");
  container.innerHTML = "";
  tabs.forEach((tab, i) => {
    const btn = document.createElement("button");
    btn.className = "primary";
    btn.innerText = tab.name;
    btn.onclick = () => openTab(i);
    container.appendChild(btn);
  });
}

function openNewTab() {
  const name = prompt("Tab adı:");
  if (!name) return;
  tabs.push({ name, entries: [] });
  save();
  renderTabs();
}

function openTab(index) {
  currentTab = index;
  document.getElementById("home").classList.add("hidden");
  document.getElementById("tabDetail").classList.remove("hidden");
  document.getElementById("tabName").innerText = tabs[index].name;
  renderEntries();
}

function goHome() {
  document.getElementById("tabDetail").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function addEntry() {
  const value = document.getElementById("valueInput").value;
  const unit = document.getElementById("unit").value;
  if (!value) return alert("Sayı gir!");

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  tabs[currentTab].entries.push({
    value: Number(value),
    unit,
    date: today,
    time: now.toLocaleTimeString()
  });

  save();
  document.getElementById("valueInput").value = "";
  renderEntries();
}

function renderEntries() {
  const div = document.getElementById("entries");
  const totalDiv = document.getElementById("totals");
  div.innerHTML = "";
  totalDiv.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  let total = 0;

  tabs[currentTab].entries
    .filter(e => e.date === today)
    .forEach(e => {
      total += e.value;
      div.innerHTML += `<p>${e.value} ${e.unit} - ${e.time}</p>`;
    });

  totalDiv.innerHTML = `<strong>Bugün toplam: ${total}</strong>`;
}

function openSettings() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function toggleDarkMode(el) {
  document.documentElement.classList.toggle("dark", el.checked);
}

renderTabs();
