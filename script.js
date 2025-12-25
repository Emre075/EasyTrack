const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settings = document.getElementById("settings");
const themeSelect = document.getElementById("themeSelect");

let state = "home";
let activeTab = null;

let data = JSON.parse(localStorage.getItem("easytrack")) || {
  theme: "light",
  tabs: []
};

const units = [
  { key: "sayfa", label: "Sayfa" },
  { key: "dakika", label: "Dakika" },
  { key: "saat", label: "Saat" },
  { key: "adim", label: "Adım" },
  { key: "litre", label: "Litre" }
];

const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

function save() {
  localStorage.setItem("easytrack", JSON.stringify(data));
}

function todayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function applyTheme() {
  document.body.className = data.theme === "dark" ? "dark" : "";
  themeSelect.value = data.theme;
}

themeSelect.onchange = () => {
  data.theme = themeSelect.value;
  save();
  applyTheme();
};

settingsBtn.onclick = () => settings.classList.remove("hidden");
function closeSettings() {
  settings.classList.add("hidden");
}

backBtn.onclick = () => {
  state = "home";
  activeTab = null;
  backBtn.classList.add("hidden");
  renderHome();
};

function renderHome() {
  app.innerHTML = "";
  data.tabs.forEach((tab, i) => {
    const div = document.createElement("div");
    div.className = "tab";
    div.textContent = `${tab.name} (${tab.unit})`;
    div.onclick = () => openTab(i);
    app.appendChild(div);
  });

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕ Yeni Tab";
  addBtn.onclick = addTab;
  app.appendChild(addBtn);
}

function addTab() {
  const name = prompt("Tab adı:");
  if (!name) return;

  let unit = prompt(
    "Birim seç:\n" + units.map(u => u.label).join(", ")
  );
  const found = units.find(u => u.label === unit);
  if (!found) return alert("Geçerli birim seç");

  data.tabs.push({
    name,
    unit: found.label,
    days: days.map(d => ({ name: d, entries: [] }))
  });

  save();
  renderHome();
}

function openTab(i) {
  state = "tab";
  activeTab = i;
  backBtn.classList.remove("hidden");
  app.innerHTML = "";

  const tab = data.tabs[i];

  tab.days.forEach((day, dIndex) => {
    const div = document.createElement("div");
    div.className = "day";

    div.innerHTML = `<strong>${day.name}</strong>`;

    if (dIndex <= todayIndex()) {
      const btn = document.createElement("button");
      btn.textContent = "➕";
      btn.onclick = () => addEntry(i, dIndex);
      div.appendChild(btn);
    }

    let total = 0;
    day.entries.forEach(e => {
      total += e.value;
      const p = document.createElement("div");
      p.className = "entry";
      p.textContent = `${e.value} ${tab.unit} · ${e.time}`;
      div.appendChild(p);
    });

    if (day.entries.length) {
      const t = document.createElement("div");
      t.innerHTML = `<b>Toplam:</b> ${total} ${tab.unit}`;
      div.appendChild(t);
    }

    app.appendChild(div);
  });
}

function addEntry(tabIndex, dayIndex) {
  const value = Number(prompt("Değer gir:"));
  if (!value) return;

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  data.tabs[tabIndex].days[dayIndex].entries.push({ value, time });
  save();
  openTab(tabIndex);
}

applyTheme();
renderHome();
