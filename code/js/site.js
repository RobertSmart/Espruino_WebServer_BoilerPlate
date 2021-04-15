function postRequest(path, value, cb) {
  var xmlHttp = new XMLHttpRequest();

  // need to parse the response and send back to the calling function
  xmlHttp.onreadystatechange = function()
  {
    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
      if (xmlHttp.status == 200)
      {
        if(cb) cb(xmlHttp.responseText);
      } else {
        console.log(xmlHttp.status);
      }
    }
  }

  var json = JSON.stringify({
    value: value
  });
  xmlHttp.open("POST", path, true);
  xmlHttp.setRequestHeader("Content-type", "application/json");
  xmlHttp.send(json);
}

function getRequest(path, cb) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
      if (xmlHttp.status == 200) {
        var data = JSON.parse(xmlHttp.responseText);
        if(cb) cb(data)
      } else {
        console.log('Refresh failed: ' + xmlHttp.status);
      }
    }
  }

  xmlHttp.open("GET", path);
  xmlHttp.send();
}

// function updateValue(value) {
//   if (value > 100) {
//     value = 100
//   }
//   if (value < 0) {
//     value = 0
//   }
//   document.getElementById('setPercent').value = parseInt(value)
//   postRequest('data', value, null)
// }

function submitBLEId() {
  var creds = {
    id:document.getElementById('BLESelect').value
  }
  postRequest('ble', creds, function (text) {
    console.log(text)
  })
}

function populateBLEList() {
  getRequest('/ble_list', function (aplist) {
    // let aps = JSON.parse
    var x = document.getElementById("BLESelect");
    aplist.forEach(function (el) {
      if (el.id == "") return
      var option = document.createElement("option");
      option.text = el.id + " | rssi " + el.rssi;
      option.value = el.id
      x.add(option, x[0]);
    })
  })
}
