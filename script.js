let data = JSON.parse(localStorage.getItem("data")) || {}
let weekOffset = 0
let chart

// Onboarding
if (!localStorage.getItem("seen")) {
  document.getElementById("onboarding").style.display = "flex"
}

function closeOnboarding() {
  document.getElementById("onboarding").style.display = "none"
  localStorage.setItem("seen", true)
}

// Date helpers
function getWeekKey(offset=0){
  let d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1 + offset*7)
  return d.toISOString().slice(0,10)
}

function render(){
  let key = getWeekKey(weekOffset)
  document.getElementById("weekLabel").innerText = key
  let list = data[key] || []
  let box = document.getElementById("entries")
  box.innerHTML = ""

  let sum = 0

  list.forEach(e=>{
    sum += e.value
    box.innerHTML += `<div>${e.title}: ${e.value} ${e.unit}</div>`
  })

  document.getElementById("total").innerText = "Toplam: " + sum

  // Average (Mon → Yesterday)
  let days = new Date().getDay() - 1
  if (days < 1) days = 1
  document.getElementById("average").innerText =
    "Günlük Ortalama: " + (sum/days).toFixed(1)

  drawChart(list)
}

// Add
function addEntry(){
  let title = document.getElementById("title").value
  let unit = document.getElementById("unit").value
  let value = Number(document.getElementById("value").value)
  if(!title || !value) return

  let key = getWeekKey(weekOffset)
  if(!data[key]) data[key]=[]
  data[key].push({title,unit,value})

  localStorage.setItem("data", JSON.stringify(data))
  notify(title, value, unit)
  render()
}

// Chart
function drawChart(list){
  let ctx = document.getElementById("chart")
  if(chart) chart.destroy()

  chart = new Chart(ctx,{
    type:'bar',
    data:{
      labels:list.map(e=>e.title),
      datasets:[{
        data:list.map(e=>e.value),
        backgroundColor:'#22c55e'
      }]
    }
  })
}

// Navigation
function prevWeek(){weekOffset--; render()}
function nextWeek(){weekOffset++; render()}

// Notification
function notify(t,v,u){
  if(Notification.permission==="granted"){
    new Notification("EasyTrack",{
      body:`Bugün ${t}: ${v} ${u} 💪`
    })
  } else {
    Notification.requestPermission()
  }
}

// Export
function exportPDF(){
  const {jsPDF} = window.jspdf
  let pdf = new jsPDF()
  pdf.text(JSON.stringify(data,null,2),10,10)
  pdf.save("easytrack.pdf")
}

function exportExcel(){
  let wb = XLSX.utils.book_new()
  let ws = XLSX.utils.json_to_sheet(
    Object.entries(data)
  )
  XLSX.utils.book_append_sheet(wb,ws,"Data")
  XLSX.writeFile(wb,"easytrack.xlsx")
}

render()
