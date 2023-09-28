
function reloadFunction() {
  var reading_request = new XMLHttpRequest();
  reading_request.onreadystatechange = function () {
    if (reading_request.readyState == 4) {
      JSON.parse(reading_request.responseText).forEach(data => {
        document.getElementById("secondMac").innerHTML += "<div> <span>" + data.dmac + "</span> <input type=" + "button" + " id=" + "silButton" + " value=" + "Sil" + " onclick=" + "deleteButton()" + ">" + "</div>";
        anycounter++;
        document.getElementById("secondInfo").innerHTML += "<div id=" + anycounter + "ikincibilgidiv" + " >" + " <span>" + data.time + "</span> </div>";
      });
    }
  }
  reading_request.open("GET", "http://localhost:3000/api/devices/read", true);
  reading_request.send();
}

let deviceCount = 0;
let controlCounter;
reloadFunction();
let anycounter = 0;

function clickButton() {
  var request = new XMLHttpRequest();
  var data = {};
  var url = "http://localhost:3000/api/devices/add";
  if(document.getElementById("textInput").value.length < 15){
  if (document.getElementById("textInput").value != "") {
    deviceCount++;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    data = { dmac: document.getElementById("textInput").value, time: dateTime, id: deviceCount };
    anycounter++;
    document.getElementById("secondMac").innerHTML += "<div> <span>" + document.getElementById("textInput").value
      + "</span> <input type=" + "button" + " id=" + "silButton" + " value=" + "Sil" + " onclick=" + "deleteButton()" + ">" + "</div>";

    document.getElementById("secondInfo").innerHTML += "<div id=" + anycounter + "ikincibilgidiv" + " >" + " <span>" + dateTime + "</span> </div>";

    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function () {
      if (request.readyState == XMLHttpRequest.DONE) {
        if (request.status == 200) {
          console.log("Başarılı cevap: " + request.responseText);
        } else {
          console.error("Hata kodu: " + request.status);
        }
      }
    };
    request.send(JSON.stringify(data));
    document.getElementById("textInput").value = null;
  }
}
else{
  document.getElementById("maxLengthError").style.display = "block";
  document.getElementById("popUpBackground").style.display = "block";
    setTimeout(() => {
      document.getElementById("maxLengthError").style.display = "none";
      document.getElementById("textInput").value = null;
      document.getElementById("popUpBackground").style.display = "none";
    }, 10000);
}
}
function lengthButton(){
  document.getElementById("maxLengthError").style.display = "none";
      document.getElementById("textInput").value = null;
      document.getElementById("popUpBackground").style.display = "none";
}
let parentDiv;

function deleteButton() {
  parentDiv = event.target.parentElement;
  document.getElementById("popUpDeleteMessage").style.display = "block";
  document.getElementById("popUpBackground").style.display = "block";

}

function confirmDeleteButton() {
  const spanElement = parentDiv.querySelector('span');
  const spanValue = spanElement.textContent;
  //console.log(spanValue)
  var sendingData = {};
  read_req = new XMLHttpRequest();
  read_req.onreadystatechange = function () {
    if (read_req.readyState == 4) {
      JSON.parse(read_req.responseText).forEach(data => {
        if (data.dmac == spanValue) {
          sendingData = data;
          deleteData(sendingData);
          parentDiv.remove();
        }
      });
    }
  }
  read_req.open("GET", "http://localhost:3000/api/devices/read", true);
  read_req.send();
}

function cancelButton() {
  document.getElementById("popUpDeleteMessage").style.display = "none";
  document.getElementById("popUpBackground").style.display = "none";
}



async function deleteData(comingData) {
  delete_req = new XMLHttpRequest();
  delete_req.open("DELETE", "http://localhost:3000/api/devices/delete", true);
  delete_req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  delete_req.onload = function () {
    if (delete_req.status === 200) {

    }

  }
  delete_req.send(JSON.stringify(comingData));

  for (let index = 1; index <= anycounter; index++) {
    if (document.getElementById(index + "ikincibilgidiv")) {
      const span = document.getElementById(index + "ikincibilgidiv").querySelector('span');
      if (span.textContent == comingData.time) {
        document.getElementById(index + "ikincibilgidiv").remove();
      }
    }

  }
  document.getElementById("popUpDeleteMessage").style.display = "none";
  document.getElementById("popUpBackground").style.display = "none";
}
let alertController = 0;

function statusButtonColor() {
  const status_req = new XMLHttpRequest();
  status_req.open("GET", "http://localhost:3000/api/devices/statusOfMQTT", true);
  status_req.onreadystatechange = function () {
      if (status_req.status === 200) {
        console.log(status_req.responseText);
        if(status_req.responseText == "connected")
          document.getElementById("connectStatusDiv").style.backgroundColor = "green";
        else
          document.getElementById("connectStatusDiv").style.backgroundColor = "red";
      }
  }
  status_req.send();
  
}

function connectButton() {
  const socket = new WebSocket("ws://localhost:8070");
  controlCounter = 0;
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3000/api/devices/runMQTT';
  const method = 'POST';

  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();

  let jsonData = null;
  socket.onmessage = function (event) {
    jsonData = JSON.parse(event.data);
    statusButtonColor();
    if (controlCounter == 0)
      updateTable();

  }
  function updateTable() {
    var reading_request = new XMLHttpRequest();
    reading_request.open("GET", "http://localhost:3000/api/devices/read", true);
    reading_request.onreadystatechange = function () {
      if (reading_request.readyState == 4) {
        jsonData.obj.forEach(data => {
          JSON.parse(reading_request.responseText).forEach(mqttData => {
            if (mqttData)
              if (data.dmac == mqttData.dmac) {
                document.getElementById("listeMac").innerHTML += "<div id=" + "macler" + " >" + " <span>" + data.dmac + "</span> </div>";
                document.getElementById("listeRssi").innerHTML += "<div id=" + "macler" + " >" + " <span>" + data.rssi + "</span> </div>";
                document.getElementById("listeTime").innerHTML += "<div id=" + "macler" + " > " + "<span>" + data.time + "</span> </div>";
                if (data.type == 4) {
                  document.getElementById("listeInfo").innerHTML += "<div id=" + "maclerSinyal" + " >" + "<span>" + "Buton Sinyali" + "</span> </div>";
                  document.getElementById("alertCountDiv").textContent = ++alertController;
                  document.getElementById("popUpAlert").style.display = "block";
                  document.getElementById("popUpBackground").style.display = "block";
                  document.getElementById("popUpAlert").innerHTML = "<br/> <span>You have received a button signal!! <br/> from " + data.dmac + "</span>";
                  setTimeout(() => {
                    document.getElementById("popUpAlert").style.display = "none";
                    document.getElementById("popUpBackground").style.display = "none";
                  }, 2000);
                }
                else if (data.type == 32) {
                  document.getElementById("listeInfo").innerHTML += "<div id=" + "macler" + " >" + "<span>" + "Normal Sinyal" + "</span> </div>";
                }
              }
          });
        });
      }
    }


    reading_request.send();



  }
}
function disconnectButton() {
  controlCounter = 1;
  var open_request = new XMLHttpRequest();
  open_request.open("POST", "http://localhost:3000/api/devices/closeMQTT", true);
  open_request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  open_request.onreadystatechange = function () {
    if (open_request.readyState == XMLHttpRequest.DONE) {
      if (open_request.status == 200) {
        console.log("Başarılı cevap: " + open_request.responseText);
        document.getElementById("connectStatusDiv").style.backgroundColor = "red";
      } else {
        console.error("Hata kodu: " + open_request.status);
      }
    }
  }
  open_request.send();
}






