function main() {

  var currentValue
  var wifi = require('Wifi')

  function setAdminMode() {
    console.log('starting AP')
    wifi.startAP('BLE Detect', {
      authMode: 'open'
    }, function () {
      require('webserver').startServer(sensorWatch.getDeviceList, updateBleId)
    })
  }

  function setUpDevice() {
      setAdminMode()
  }

  setUpDevice()

}
E.on('init', main)
save()
