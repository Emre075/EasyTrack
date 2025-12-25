const app = document.getElementById("app");
const addTabBtn = document.getElementById("addTab");

let data = JSON.parse(localStorage.getItem("easytrack")) || {
  tabs: []
};

const units = ["Sayfa","Dakika","Saat","Adım","Litre","Adet"];

function save() {
  localStorage.setItem("easytrack", JSON.stringify(data));
}

function todayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function render() {
  app.innerHTML = "";
  data.tabs.forEach((tab, i) => {
    const div = document.createElement("div");
    div.className = "tab";
    div.textContent = `${tab.name} (${tab.unit})`;
    div.onclick = () => openTab(i);
    app.appendChild(div);
  });
}

function openTab(i) {
  const tab = data.tabs[i];
  app.innerHTML = `<h2>${tab.name}</h2>`;

  tab.days.forEach((day, dIndex) => {
    const d = document.createElement("div");
    d.className = "day";

    d.innerHTML = `<strong>${day.name}</strong>`;
    if (dIndex <= todayIndex()) {
      const btn = document.createElement("button");
      btn.textContent = "➕";
      btn.onclick = () => addEntry(i, dIndex);
      d.appendChild(btn);
    }

    let total = 0;
    day.entries.forEach(e => {
      total += Number(e.value);
      const p = document.createElement("div");
      p.className = "entry";
      p.textContent = `${e.value} ${tab.unit} · ${e.time}`;
      d.appendChild(p);
    });

    if (day.entries.length)
      d.innerHTML += `<div><b>Toplam:</b> ${total} ${tab.unit}</div>`;

    app.appendChild(d);
  });
}

function addEntry(tabIndex, dayIndex) {
  const value = prompt("Değer gir:");
  if (!value || isNaN(value)) return;

  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  data.tabs[tabIndex].days[dayIndex].entries.push({ value, time });
  save();
  openTab(tabIndex);
}

addTabBtn.onclick = () => {
  const name = prompt("Tab adı:");
  if (!name) return;

  const unit = prompt("Birim seç:\n" + units.join(", "));
  if (!units.includes(unit)) return alert("Geçerli birim seç");

  const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"]
    .map(d => ({ name: d, entries: [] }));

  data.tabs.push({ name, unit, days });
  save();
  render();
};

render();
