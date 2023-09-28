let data;
function getFromApi() {
  let sendData;
  var reading_request = new XMLHttpRequest();
  reading_request.onreadystatechange = function () {
    if (reading_request.readyState == 4) {
      sendData = JSON.parse(reading_request.responseText);
      setTimeout(() => {
        return sendData;
      }, 1000);
    }
  }
  reading_request.open("GET", "http://localhost:3000/api/devices/read", true);
  reading_request.send();
  

}

