function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var clockText = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    document.getElementById('clock').textContent = clockText;
}
setInterval(updateClock, 1000);
updateClock();

const setDocument = (circleint, textbox, SYS, DIA, PUL, SYSint, DIAint, PULint, advice, advicestr) => {
      document.getElementById("circleint").innerHTML = circleint;
      document.getElementById("textbox").innerHTML = textbox;
      document.getElementById("SYS").innerHTML = SYS;
      document.getElementById("DIA").innerHTML =DIA;
      document.getElementById("PUL").innerHTML =PUL;
      document.getElementById("SYSint").innerHTML =SYSint;
      document.getElementById("DIAint").innerHTML =DIAint;
      document.getElementById("PULint").innerHTML =PULint;
      document.getElementById("advice").innerHTML =advice;
      document.getElementById("advicestr").innerHTML =advicestr;
}

const updateStatus = (statusToUpdate) => {
  const pageStatusElement = document.getElementById("pageStatus");
  pageStatusElement.classList.remove(pageStatusElement.className);
  pageStatusElement.classList.add(statusToUpdate);
  switch (statusToUpdate) {
    case "green":
      setDocument(
        "ปกติ",
        "ผลการวัดความดันได้ดังนี้",
        "ค่าความดันขณะหัวใจบีบตัว: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mmHg",
        "ค่าความดันขณะหัวใจคลายตัว:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mmHg",
        "อัตราการเตันของหัวใจ:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /Min",
        "123",
        "123",
        "123",
        "ยินดีด้วย คุณมีความดันปกติ",
        "",
      )
      break;

    case "red":
      setDocument(
        "สูง",
        "ผลการวัดความดันได้ดังนี้",
        "ค่าความดันขณะหัวใจบีบตัว: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mmHg",
        "ค่าความดันขณะหัวใจคลายตัว:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mmHg",
        "อัตราการเตันของหัวใจ:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /Min",
        "123",
        "123",
        "123",
        "คำแนะนำ:",
        "หลีกเลี่ยงอาหารรสเค็ม<br>งดสูบบุหรี่<br>งดดื่มแอลกอฮอ์",
      )
      break;

    case "yellow":
      setDocument(
        "ต่ำ",
        "ผลการวัดความดันได้ดังนี้",
        "ค่าความดันขณะหัวใจบีบตัว: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mmHg",
        "ค่าความดันขณะหัวใจคลายตัว:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mmHg",
        "อัตราการเตันของหัวใจ:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /Min",
        "123",
        "123",
        "123",
        "คำแนะนำ:",
        "",
      )
      break;

    case "error":
      setDocument(
        "X",
        "ERROR",
        "อ่านค่าผิดพลาดกรุณาลองใหม่อีกครั้ง",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      )
      break;

    case "idle":
      setDocument(
        "",
        "PulseMate",
        "",
        "",
        "",
        "พร้อมให้บริการ",
        "",
        "",
        "",
        "",
      )

      break;

    default:
      break;
  }
}

const getData = () => {
  const Http = new XMLHttpRequest();
  const url='http://3.1.206.42:1880/getData';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    const data = JSON.parse(Http.responseText)
    if (data.error) {
      updateStatus("error");
    } else {
      updateStatus("green");
      document.getElementById("SYSint").innerHTML = data.sys;
      document.getElementById("PULint").innerHTML = data.pul;
      document.getElementById("DIAint").innerHTML = data.dia;
    }
  };
}

const socket = new WebSocket("wss://3.1.206.42:1880/dataUpdate");


// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data)
  if (data.error) {
    updateStatus("error");
  } else {
    updateStatus("green");
    document.getElementById("SYSint").innerHTML = data.sys;
    document.getElementById("PULint").innerHTML = data.pul;
    document.getElementById("DIAint").innerHTML = data.dia;
  }
});

const socket = new WebSocket("ws://3.1.206.42:1880/dataUpdate");


// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data)
  if (data.error) {
    updateStatus("error");
  } else {
    updateStatus("green");
    document.getElementById("SYSint").innerHTML = data.sys;
    document.getElementById("PULint").innerHTML = data.pul;
    document.getElementById("DIAint").innerHTML = data.dia;
  }
});
