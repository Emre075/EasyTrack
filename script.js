const content = document.getElementById("content");
const addTabBtn = document.getElementById("addTabBtn");

let data = JSON.parse(localStorage.getItem("easytrack")) || {
  tabs: [],
  theme: "light"
};

function save() {
  localStorage.setItem("easytrack", JSON.stringify(data));
}

function render() {
  document.body.className = data.theme === "dark" ? "dark" : "";
  content.innerHTML = "";

  data.tabs.forEach((tab, index) => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<strong>${tab.name}</strong>`;
    div.onclick = () => openTab(index);
    content.appendChild(div);
  });
}

function openTab(i) {
  const tab = data.tabs[i];
  content.innerHTML = `<h2>${tab.name}</h2>`;

  tab.days.forEach(day => {
    const d = document.createElement("div");
    d.className = "day";

    d.innerHTML = `<strong>${day.name}</strong>
      <button onclick="addEntry(${i}, '${day.name}')">➕</button>`;

    day.entries.forEach(e => {
      const p = document.createElement("div");
      p.className = "entry";
      p.textContent = `${e.value} · ${e.time}`;
      d.appendChild(p);
    });

    content.appendChild(d);
  });
}

function addEntry(tabIndex, dayName) {
  const value = prompt("Kaç sayfa?");
  if (!value) return;

  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const tab = data.tabs[tabIndex];
  const day = tab.days.find(d => d.name === dayName);

  day.entries.push({ value, time });
  save();
  openTab(tabIndex);
}

addTabBtn.onclick = () => {
  const name = prompt("Tab adı:");
  if (!name) return;

  const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"]
    .map(d => ({ name: d, entries: [] }));

  data.tabs.push({ name, days });
  save();
  render();
};

render();
