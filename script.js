const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");
const settingsBtn = document.getElementById("settingsBtn");

const settings = document.getElementById("settings");
const onboarding = document.getElementById("onboarding");

const themeSelect = document.getElementById("themeSelect");

const addTabModal = document.getElementById("addTabModal");
const tabNameInput = document.getElementById("tabName");
const unitSelect = document.getElementById("unitSelect");

const addEntryModal = document.getElementById("addEntryModal");
const entryValueInput = document.getElementById("entryValue");

let activeTab = null;
let activeDay = null;

const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

let data = JSON.parse(localStorage.getItem("easytrack")) || {
  version: 2,
  theme: "light",
  firstRun: true,
  tabs: []
};

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
function closeSettings() { settings.classList.add("hidden"); }

function closeOnboarding() {
  onboarding.classList.add("hidden");
  data.firstRun = false;
  save();
}

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
  addBtn.onclick = () => addTabModal.classList.remove("hidden");
  app.appendChild(addBtn);
}

function closeAddTab() {
  addTabModal.classList.add("hidden");
  tabNameInput.value = "";
}

document.getElementById("createTab").onclick = () => {
  const name = tabNameInput.value.trim();
  if (!name) return alert("Tab adı gir");

  data.tabs.push({
    name,
    unit: unitSelect.value,
    days: days.map(d => ({ name: d, entries: [] }))
  });

  save();
  closeAddTab();
  renderHome();
};

function openTab(i) {
  activeTab = i;
  backBtn.classList.remove("hidden");
  app.innerHTML = "";

  const tab = data.tabs[i];
  const today = todayIndex();

  let weeklyTotal = 0;
  let daysWithData = 0;

  tab.days.forEach((day, dIndex) => {
    const div = document.createElement("div");
    div.className = "day";
    if (dIndex === today) div.classList.add("today");

    const header = document.createElement("div");
    header.className = "day-header";
    header.innerHTML = `<strong>${day.name}</strong>`;

    if (dIndex <= today) {
      const btn = document.createElement("button");
      btn.textContent = "➕";
      btn.onclick = () => {
        activeDay = dIndex;
        addEntryModal.classList.remove("hidden");
        entryValueInput.value = "";
      };
      header.appendChild(btn);
    }

    div.appendChild(header);

    let dailyTotal = 0;
    day.entries.forEach(e => {
      dailyTotal += e.value;
      weeklyTotal += e.value;
      const p = document.createElement("div");
      p.className = "entry";
      p.textContent = `${e.value} ${tab.unit} · ${e.time}`;
      div.appendChild(p);
    });

    if (day.entries.length) {
      daysWithData++;
      div.innerHTML += `<b>Toplam:</b> ${dailyTotal} ${tab.unit}`;
    }

    app.appendChild(div);
  });

  const stats = document.createElement("div");
  stats.className = "tab";
  stats.innerHTML = `
    📊 Haftalık Toplam: <b>${weeklyTotal}</b> ${tab.unit}<br>
    📈 Günlük Ortalama: <b>${daysWithData ? (weeklyTotal/daysWithData).toFixed(1) : 0}</b> ${tab.unit}
  `;
  app.appendChild(stats);
}

backBtn.onclick = () => {
  activeTab = null;
  backBtn.classList.add("hidden");
  renderHome();
};

function closeAddEntry() {
  addEntryModal.classList.add("hidden");
}

document.getElementById("saveEntry").onclick = () => {
  const value = Number(entryValueInput.value);
  if (!Number.isFinite(value) || value <= 0) return alert("Sadece sayı gir");

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  data.tabs[activeTab].days[activeDay].entries.push({ value, time });

  save();
  closeAddEntry();
  openTab(activeTab);
};

applyTheme();
renderHome();

if (data.firstRun) onboarding.classList.remove("hidden");
