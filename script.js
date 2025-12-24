// LocalStorage setup
let count = localStorage.getItem("count");

if (count === null) {
  count = 0;
} else {
  count = parseInt(count);
}

document.getElementById("count").innerText = count;

// Klik functie
function klik() {
  count++;
  document.getElementById("count").innerText = count;
  localStorage.setItem("count", count);
}

// Reset functie
function reset() {
  count = 0;
  document.getElementById("count").innerText = count;
  localStorage.setItem("count", count);
}

// Meldingen functie
function vraagToestemming() {
  Notification.requestPermission().then(result => {
    if (result === "granted") {
      new Notification("🔥 EasyTrack", {
        body: "Je app werkt met meldingen 😎"
      });
    }
  });
}
