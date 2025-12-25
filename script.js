let data = JSON.parse(localStorage.getItem("data")) || {};
let currentWeek = new Date();

const ctx = document.getElementById("chart");
let chart;

if (!localStorage.getItem("onboarded")) {
  document.getElementById("onboarding").style.display = "flex";
}

function closeOnboarding() {
  localStorage.setItem("onboarded", "1");
  document.getElementById("onboarding").style.display = "none";
}

function openNewTab() {
  document.getElementById("newTabModal").style.display = "flex";
}

function closeNewTab() {
  document.getElementById("newTabModal").style.display = "none";
}

function createTab() {
  const name = tabName.value;
  const unit = unitSelect.value;
  if (!name) return;

  if (!data[name]) data[name] = {};

  localStorage.setItem("data", JSON.stringify(data));
  closeNewTab();
  render();
}

function render() {
  document.getElementById("tabs").innerHTML = "";

  Object.keys(data).forEach(tab => {
    const div = document.createElement("div");
    div.className = "tab";

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Değer gir";
    input.onchange = () => saveValue(tab, input.value);

    div.innerHTML = `<h3>${tab}</h3>`;
    div.appendChild(input);
    document.getElementById("tabs").appendChild(div);
  });

  updateChart();
}

function saveValue(tab, value) {
  const date = new Date().toISOString().split("T")[0];
  if (!data[tab]) data[tab] = {};
  data[tab][date] = Number(value);

  localStorage.setItem("data", JSON.stringify(data));
  scheduleNotification(tab, value);
  render();
}

function updateChart() {
  const labels = [];
  const values = [];

  Object.keys(data).forEach(tab => {
    const sum = Object.values(data[tab]).reduce((a,b)=>a+b,0);
    labels.push(tab);
    values.push(sum);
  });

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Toplam",
        data: values
      }]
    }
  });
}

function scheduleNotification(tab, value) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
    return;
  }

  setTimeout(() => {
    new Notification("💪 EasyTrack", {
      body: `Bugün ${tab} için ${value} yaptın. Devam!`
    });
  }, 3000);
}

function goBack() {
  history.back();
}

render();
