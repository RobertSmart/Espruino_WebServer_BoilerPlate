var HTTP_OK = 200;
var HTTP_NOTFOUND = 404;
var deviceListFunction;
var updateBleIdFunction;

var css = @@css

var blePage = @@blePage

var js = @@js

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
        // do something with the returned ID
        
        res.writeHead(HTTP_OK, {'Content-Type': 'text/html'});
        res.end("gotBleId OK");
      });
    }
}

module.exports.startServer = function () {
  require("http").createServer(pageRequest).listen(80);
}
