var HTTP_OK = 200;
var HTTP_NOTFOUND = 404;
var deviceListFunction;
var updateBleIdFunction;

var css = ".header, body, button {\r\n  color: #fff\r\n}\r\n\r\nhtml {\r\n  font-family: Avenir, 'Avenir Next', 'Helvetica Neue', 'Segoe UI', Verdana, sans-serif;\r\n  font-mono: 'Consolas', 'Monaco', 'Courier New', monospace\r\n}\r\n\r\nbody {\r\n  background-color: #272B30\r\n}\r\n\r\n.flex-container {\r\n  display: flex;\r\n  justify-content: center\r\n}\r\n\r\n.header {\r\n  text-align: center\r\n}\r\n\r\ninput[type=number] {\r\n  width: 100%;\r\n  height: 40px;\r\n  margin: 8px 0;\r\n  box-sizing: border-box\r\n}\r\n\r\nbutton {\r\n  background-color: #6f6f6f;\r\n  border: 1px solid #6f6f6f;\r\n  padding: 10px 24px;\r\n  cursor: pointer;\r\n  float: left;\r\n  margin: 5px;\r\n  border-radius: 5px;\r\n  width: 150px;\r\n  height: 50px\r\n}\r\n\r\n.btn-block {\r\n  width: 100%;\r\n  margin: auto\r\n}\r\n\r\n.select-css {\r\n  display: block;\r\n  font-size: 16px;\r\n  font-family: sans-serif;\r\n  font-weight: 700;\r\n  color: #444;\r\n  line-height: 1.3;\r\n  padding: .6em 1.4em .5em .8em;\r\n  width: 100%;\r\n  max-width: 100%;\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  border: 1px solid #aaa;\r\n  box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);\r\n  border-radius: .5em;\r\n  -moz-appearance: none;\r\n  -webkit-appearance: none;\r\n  appearance: none;\r\n  background-color: #fff;\r\n  background-repeat: no-repeat, repeat;\r\n  background-position: right .7em top 50%, 0 0;\r\n  background-size: .65em auto, 100%\r\n}\r\n\r\n.select-css-icon {\r\n  background-image: url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E), linear-gradient(to bottom, #fff 0, #e5e5e5 100%)\r\n}\r\n\r\n.select-css::-ms-expand {\r\n  display: none\r\n}\r\n\r\n.select-css:hover {\r\n  border-color: #888\r\n}\r\n\r\n.select-css:focus {\r\n  border-color: #aaa;\r\n  box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);\r\n  box-shadow: 0 0 0 3px -moz-mac-focusring;\r\n  color: #222;\r\n  outline: 0\r\n}\r\n\r\n.select-css option {\r\n  font-weight: 400\r\n}\r\n"

var blePage = "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n  <meta charset=\"utf-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>CO2 Feedback device</title>\r\n  <link rel=\"stylesheet\" href=\"style.min.css\">\r\n  <script src=\"site.min.js\"></script>\r\n</head>\r\n\r\n<body>\r\n  <div class=\"header center\">\r\n    <h1>Room Feedback Device Setup</h1>\r\n  </div>\r\n  <div class=\"flex-container\">\r\n    <div style=\"width:80%;\">\r\n      <h4 class=\"center\">Pick BLE Device</h4>\r\n      <div class=\"flex-container\"><select id=\"BLESelect\" size=1 class=\"select-css select-css-icon\">\r\n        </select>\r\n      </div>\r\n      <br>\r\n      <div class=\"flex-container\">\r\n        <button class=\"btn-block\" multiple=\"false\" onclick=\"submitBLEId()\">Connect to BLE Device</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <script src=\"site.min.js\"></script>\r\n  <script>\r\n    document.addEventListener(\"DOMContentLoaded\", function() {\r\n      populateBLEList();\r\n    });\r\n  </script>\r\n</body>\r\n\r\n</html>\r\n"

var js = "function postRequest(path, value, cb) {\r\n  var xmlHttp = new XMLHttpRequest();\r\n\r\n  // need to parse the response and send back to the calling function\r\n\r\n  xmlHttp.onreadystatechange = function()\r\n  {\r\n    if (xmlHttp.readyState == XMLHttpRequest.DONE) {\r\n      if (xmlHttp.status == 200)\r\n      {\r\n        if(cb) cb(xmlHttp.responseText);\r\n      } else {\r\n        console.log(xmlHttp.status);\r\n      }\r\n    }\r\n  }\r\n\r\n  var json = JSON.stringify({\r\n    value: value\r\n  });\r\n  xmlHttp.open(\"POST\", path, true);\r\n  xmlHttp.setRequestHeader(\"Content-type\", \"application/json\");\r\n  xmlHttp.send(json);\r\n}\r\n\r\nfunction getRequest(path, cb) {\r\n  var xmlHttp = new XMLHttpRequest();\r\n\r\n  xmlHttp.onreadystatechange = function () {\r\n    if (xmlHttp.readyState == XMLHttpRequest.DONE) {\r\n      if (xmlHttp.status == 200) {\r\n        var data = JSON.parse(xmlHttp.responseText);\r\n        if(cb) cb(data)\r\n      } else {\r\n        console.log('Refresh failed: ' + xmlHttp.status);\r\n      }\r\n    }\r\n  }\r\n\r\n  xmlHttp.open(\"GET\", path);\r\n  xmlHttp.send();\r\n}\r\n\r\n// function updateValue(value) {\r\n//   if (value > 100) {\r\n//     value = 100\r\n//   }\r\n//   if (value < 0) {\r\n//     value = 0\r\n//   }\r\n//   document.getElementById('setPercent').value = parseInt(value)\r\n//   postRequest('data', value, null)\r\n// }\r\n\r\nfunction submitBLEId() {\r\n  var creds = {\r\n    id:document.getElementById('BLESelect').value\r\n  }\r\n  postRequest('ble', creds, function (text) {\r\n    console.log(text)\r\n  })\r\n}\r\n\r\nfunction populateBLEList() {\r\n  getRequest('/ble_list', function (aplist) {\r\n    // let aps = JSON.parse\r\n    var x = document.getElementById(\"BLESelect\");\r\n    aplist.forEach(function (el) {\r\n      if (el.id == \"\") return\r\n      var option = document.createElement(\"option\");\r\n      option.text = el.id + \" | rssi \" + el.rssi;\r\n      option.value = el.id\r\n      x.add(option, x[0]);\r\n    })\r\n  })\r\n}\r\n"

function isGetRequest(route, req) {
  var reqUrl = url.parse(req.url, true);
  return reqUrl.pathname === route && req.method === 'GET';
}

function isPostRequest(route, req) {
  var reqUrl = url.parse(req.url, true);
  return reqUrl.pathname === route && req.method === 'POST';
}

function pageRequest(req, res) {
  if (isGetRequest('/ble', req)) {
    res.writeHead(HTTP_OK, {
      'Content-Type': 'text/html'
    });
    res.end(blePage);
  } else if (isGetRequest('/', req)) {
    res.writeHead(302, {
      'Location': '/ble'
    });
    res.end("redirect");
  } else if (isGetRequest('/site.min.js', req)) {
    res.writeHead(HTTP_OK, {
      'Content-Type': 'text/javascript'
    });
    res.end(js);
  } else if (isGetRequest('/style.min.css', req)) {
    res.writeHead(HTTP_OK, {
      'Content-Type': 'text/css'
    });
    res.end(css);
  } else if (isGetRequest('/ble_list', req)) {
    res.writeHead(HTTP_OK, {
      'Content-Type': 'application/json'
    });
    deviceListFunction(function (bles) {
      res.end(bles != [] ? JSON.stringify(bles) : "");
    })
  }
  else if (isPostRequest('/ble',req)) {
      var bleID = "";
      req.on('data', function(d) { bleID += d; });
      req.on('end', function() {
        let bleObj = JSON.parse(bleID)
        console.log(bleObj.value.id);
        updateBleIdFunction(bleObj.value.id)
        res.writeHead(HTTP_OK, {'Content-Type': 'text/html'});
        res.end("gotBleId OK");
      });
    }
}

module.exports.startServer = function (getDeviceListFunc, updateBleIdFunc) {
  deviceListFunction = getDeviceListFunc
  updateBleIdFunction = updateBleIdFunc
  require("http").createServer(pageRequest).listen(80);
}
