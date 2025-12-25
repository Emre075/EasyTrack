const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");

const settings = document.getElementById("settings");
const addTab = document.getElementById("addTab");
const addEntry = document.getElementById("addEntry");
const onboarding = document.getElementById("onboarding");

const tabNameInput = document.getElementById("tabName");
const unitSelect = document.getElementById("unitSelect");
const entryValueInput = document.getElementById("entryValue");

let activeTab = null;
let activeDay = null;

let data = JSON.parse(localStorage.getItem("easytrack")) || {
  firstRun: true,
  theme: "light",
  lang: "tr",
  tabs: []
};

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
}

function renderHome() {
  app.innerHTML = "";
  backBtn.classList.add("hidden");

  data.tabs.forEach((tab, i) => {
    const div = document.createElement("div");
    div.className = "tab";
    div.textContent = `${tab.name} (${tab.unit})`;
    div.onclick = () => openTab(i);
    app.appendChild(div);
  });

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕ Yeni Tab";
  addBtn.onclick = () => addTab.classList.remove("hidden");
  app.appendChild(addBtn);
}

function openTab(i) {
  activeTab = i;
  backBtn.classList.remove("hidden");
  app.innerHTML = "";

  data.tabs[i].days.forEach((day, dIndex) => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<strong>${day.name}</strong>`;

    if (dIndex <= todayIndex()) {
      const btn = document.createElement("button");
      btn.textContent = "➕";
      btn.onclick = () => {
        activeDay = dIndex;
        addEntry.classList.remove("hidden");
        entryValueInput.value = "";
        entryValueInput.focus();
      };
      div.appendChild(btn);
    }

    let total = 0;
    day.entries.forEach(e => {
      total += e.value;
      const p = document.createElement("div");
      p.className = "entry";
      p.textContent = `${e.value} ${data.tabs[i].unit} · ${e.time}`;
      div.appendChild(p);
    });

    if (day.entries.length) {
      div.innerHTML += `<b>Toplam:</b> ${total} ${data.tabs[i].unit}`;
    }

    app.appendChild(div);
  });
}

document.getElementById("createTab").onclick = () => {
  if (!tabNameInput.value) return;

  data.tabs.push({
    name: tabNameInput.value,
    unit: unitSelect.value,
    days: days.map(d => ({ name: d, entries: [] }))
  });

  tabNameInput.value = "";
  addTab.classList.add("hidden");
  save();
  renderHome();
};

document.getElementById("saveEntry").onclick = () => {
  const v = Number(entryValueInput.value);
  if (!v) return;

  const time = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  data.tabs[activeTab].days[activeDay].entries.push({ value: v, time });

  save();
  addEntry.classList.add("hidden");
  openTab(activeTab);
};

function closeAddTab(){ addTab.classList.add("hidden"); }
function closeAddEntry(){ addEntry.classList.add("hidden"); }
function closeSettings(){ settings.classList.add("hidden"); }

backBtn.onclick = renderHome;
document.getElementById("settingsBtn").onclick = () => settings.classList.remove("hidden");

function finishOnboarding() {
  data.firstRun = false;
  save();
  onboarding.classList.add("hidden");
}

applyTheme();
if (data.firstRun) onboarding.classList.remove("hidden");
renderHome();
