let currentWeekOffset = 0;
let data = JSON.parse(localStorage.getItem("data")) || {};

const units = ["sayfa", "dakika", "saat", "adım", "litre"];

function getWeekKey(offset = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offset * 7);
  const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  return monday.toISOString().slice(0,10);
}

function render() {
  const weekKey = getWeekKey(currentWeekOffset);
  document.getElementById("weekTitle").innerText = "Hafta: " + weekKey;
  const container = document.getElementById("tabs");
  container.innerHTML = "";

  data[weekKey] = data[weekKey] || [];

  data[weekKey].forEach((tab, i) => {
    const div = document.createElement("div");
    div.className = "tab";
    div.innerHTML = `
      <h3>${tab.name}</h3>
      <select onchange="updateUnit('${weekKey}',${i},this.value)">
        ${units.map(u => `<option ${u===tab.unit?"selected":""}>${u}</option>`).join("")}
      </select>
      <input type="number" min="0" value="${tab.value}" 
        ${isFutureDay()? "disabled":""}
        onchange="updateValue('${weekKey}',${i},this.value)">
    `;
    container.appendChild(div);
  });

  localStorage.setItem("data", JSON.stringify(data));
}

function addTab() {
  const name = prompt("Tab adı:");
  if (!name) return;
  const weekKey = getWeekKey(currentWeekOffset);
  data[weekKey].push({ name, unit: "dakika", value: 0 });
  render();
}

function updateValue(week,i,val) {
  data[week][i].value = Number(val);
  render();
}

function updateUnit(week,i,unit) {
  data[week][i].unit = unit;
  render();
}

function prevWeek() {
  currentWeekOffset--;
  render();
}

function nextWeek() {
  if (currentWeekOffset < 0) {
    currentWeekOffset++;
    render();
  }
}

function isFutureDay() {
  return currentWeekOffset > 0;
}

function openSettings() {
  document.getElementById("settings").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settings").classList.add("hidden");
}

function enableNotifications() {
  Notification.requestPermission().then(p => {
    if (p === "granted") {
      new Notification("🔥 Hadi kanka!", {
        body: "Bugünkü hedeflerini yapmayı unutma!"
      });
    }
  });
}

function closeOnboarding() {
  document.getElementById("onboarding").classList.add("hidden");
  localStorage.setItem("seenOnboarding", "1");
}

if (!localStorage.getItem("seenOnboarding")) {
  document.getElementById("onboarding").classList.remove("hidden");
}

render();
