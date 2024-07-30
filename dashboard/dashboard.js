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

const setDocument = (circleint, advicestr) => {
      document.getElementById("circleint").innerHTML = circleint;
      document.getElementById("advicestr").innerHTML = advicestr;
}

const updateStatus = (statusToUpdate) => {
  const pageStatusElement = document.getElementById("pageStatus");
  pageStatusElement.classList.remove(pageStatusElement.className);
  pageStatusElement.classList.add(statusToUpdate);
  switch (statusToUpdate) {
    case "green":
      setDocument(
        "ปกติ",
        "ยินดีด้วย คุณมีความดันปกติ",
      )
      break;

    case "red":
      setDocument(
        "สูง",
        "หลีกเลี่ยงอาหารรสเค็ม<br>งดสูบบุหรี่<br>งดดื่มแอลกอฮอ์",
      )
      break;

    case "yellow":
      setDocument(
        "ต่ำ",
        "หลีกเลี่ยงการดื่มแอลกอฮอล์ <br> ทานอาหารที่มีประโยชน์สารอาหารครบถ้วน <br> ไม่ควรเปลี่ยนท่าทางอย่างรวดเร็วมากเกินไป",
      )
      break;

    case "error":
      setDocument(
        "",
        "",
      )
      break;

    case "idle":
      setDocument(
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
  const url='https://pulsemate.fakepng.dev/getData';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    const data = JSON.parse(Http.responseText)
    if (data.idle) {
      updateStatus("idle")
    } else if (data.error) {
      updateStatus("error");
    } else {
      if (data.sys > 140 && data.dia > 90) {
        updateStatus("red");
      } else if (data.sys > 100 && data.dia > 70) {
        updateStatus("green");
      } else {
        updateStatus("yellow");
      }
      document.getElementById("SYSint").innerHTML = data.sys;
      document.getElementById("DIAint").innerHTML = data.dia;
      document.getElementById("PULint").innerHTML = data.pul;
    }
  };
}

const socket = new WebSocket("https://pulsemate.fakepng.dev/dataUpdate");

const socket2 = new WebSocket("https://pulsemate.fakepng.dev/ws/id");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data)
  if (data.idle) {
    updateStatus("idle")
  } else if (data.error) {
    updateStatus("error");
  } else {
    if (data.sys > 140 && data.dia > 90) {
      updateStatus("red");
    } else if (data.sys > 100 && data.dia > 70) {
      updateStatus("green");
    } else {
      updateStatus("yellow");
    }
    document.getElementById("SYSint").innerHTML = data.sys;
    document.getElementById("PULint").innerHTML = data.pul;
    document.getElementById("DIAint").innerHTML = data.dia;
    
    
    var userId = myuser.uid;
    var userRef = firebase.database().ref('users/' + userId);

    userRef.once('value').then(function (snapshot) {
        var userName = snapshot.val().name;
        var userSurname = snapshot.val().surname;
        var name = userName + ' ' + userSurname;
        var idobject = {
          id: name,
          header: 1,
        };
        idobject = JSON.stringify(idobject);
        socket2.send(idobject);
    }).catch(function (error) {
        console.error('Error getting user data from Realtime Database:', error);
    });
  }
});

var myuser;

var firebaseConfig = {
    apiKey: "AIzaSyBGGdqJxgpT5PZQnigaVFS-OfMD-jJxjGQ",
    authDomain: "authentication-app-2043f.firebaseapp.com",
    databaseURL: "https://authentication-app-2043f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "authentication-app-2043f",
    storageBucket: "authentication-app-2043f.appspot.com",
    messagingSenderId: "1083690050567",
    appId: "1:1083690050567:web:6c79d9fcd23a626b56f6a2",
    measurementId: "G-FTR73XSRW6"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
  myuser = user;
});

// Connection opened
socket2.addEventListener("open", (event) => {
  console.log(myuser)
});

