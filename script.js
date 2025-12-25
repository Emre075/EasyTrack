const app = document.getElementById("app");

const texts = {
  tr: {
    welcome:"Hoş geldin",
    start:"Başla",
    settings:"Ayarlar",
    theme:"Tema",
    lang:"Dil",
    close:"Kapat",
    newTab:"Yeni Tab",
    unit:"Birim",
    create:"Oluştur",
    cancel:"İptal",
    enter:"Değer Gir",
    save:"Kaydet",
    motivationLow:"Bugün düne göre daha az yaptın. Haydi toparla 💪",
    motivationHigh:"🔥 Harika gidiyorsun, devam!"
  },
  en: {
    welcome:"Welcome",
    start:"Start",
    settings:"Settings",
    theme:"Theme",
    lang:"Language",
    close:"Close",
    newTab:"New Tab",
    unit:"Unit",
    create:"Create",
    cancel:"Cancel",
    enter:"Enter value",
    save:"Save",
    motivationLow:"You did less than yesterday. Push harder 💪",
    motivationHigh:"🔥 Great job, keep going!"
  },
  nl: {
    welcome:"Welkom",
    start:"Start",
    settings:"Instellingen",
    theme:"Thema",
    lang:"Taal",
    close:"Sluiten",
    newTab:"Nieuwe Tab",
    unit:"Eenheid",
    create:"Aanmaken",
    cancel:"Annuleren",
    enter:"Waarde invoeren",
    save:"Opslaan",
    motivationLow:"Vandaag minder dan gisteren. Kom op 💪",
    motivationHigh:"🔥 Goed bezig, ga zo door!"
  }
};

let data = JSON.parse(localStorage.getItem("easytrack")) || {
  theme:"light",
  lang:"tr",
  firstRun:true,
  tabs:[]
};

function t(key){ return texts[data.lang][key]; }

function save(){ localStorage.setItem("easytrack",JSON.stringify(data)); }

function applyLang(){
  document.getElementById("obTitle").innerText=t("welcome");
  document.getElementById("obBtn").innerText=t("start");
  document.getElementById("settingsTitle").innerText=t("settings");
  document.getElementById("themeText").innerText=t("theme");
  document.getElementById("langText").innerText=t("lang");
  document.getElementById("closeBtn").innerText=t("close");
  document.getElementById("newTabText").innerText=t("newTab");
  document.getElementById("unitText").innerText=t("unit");
  document.getElementById("createTab").innerText=t("create");
  document.getElementById("cancelBtn").innerText=t("cancel");
  document.getElementById("enterValueText").innerText=t("enter");
  document.getElementById("saveEntry").innerText=t("save");
}

function renderCharts(tab){
  const chart=document.createElement("div");
  chart.className="chart";
  chart.innerHTML="<b>Haftalık Grafik</b>";
  tab.days.forEach(d=>{
    const total=d.entries.reduce((a,b)=>a+b.value,0);
    const bar=document.createElement("div");
    bar.className="bar";
    bar.style.width=(total*10)+"px";
    bar.innerText=total;
    chart.appendChild(bar);
  });
  app.appendChild(chart);
}

function motivation(tab){
  const today=new Date().getDay();
  const y=today-1;
  if(y<0)return;
  const todayTotal=tab.days[today]?.entries.reduce((a,b)=>a+b.value,0)||0;
  const yTotal=tab.days[y]?.entries.reduce((a,b)=>a+b.value,0)||0;
  alert(todayTotal<yTotal ? t("motivationLow") : t("motivationHigh"));
}

applyLang();
