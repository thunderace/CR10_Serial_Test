#!/usr/bin/node
var SerialPort  = require("serialport");

var arduinoSerialPort = null;

initSerial();

function sendCommand(command) {
  console.log('send command : ' + command);
  arduinoSerialPort.write(command + '\r\n');
}



function onDisconnected() {
}

function initSerial() {
    var serialOptions = {
      baudrate: 115200,
      parity: 'none', 
      databits: 8, 
      stopbits: 1,
      parser: SerialPort.parsers.readline(String.fromCharCode(10)),
      dtr: false
    };
    
  arduinoSerialPort = new SerialPort('/dev/cr10', serialOptions);
  
  arduinoSerialPort.on('error', function (error) {
    var date = new Date();
    var hours = '0' + date.getHours();
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(date.toLocaleDateString('fr-FR', options) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
    console.log('Serial port error ' + error );
    if (error == 'Error: Port is not open') {
      process.exit();
    }
  });

  arduinoSerialPort.open(function(err) {
    if (err) {
      console.log('Port open error : ', err);
    }
    console.log('Serial port is open');
    sendCommand('N0 M110 N0*125');
    sendCommand('M115');
    setInterval(sendCommand, 6000, 'M105');
  });
    
  arduinoSerialPort.on('data', function (data) {
    console.log(data);
//    console.log('\n');
  });
}


function resetSerial() {
  if (arduinoSerialPort == null) {
    return;
  }

  arduinoSerialPort.close(function(err) {
    if (err) {
      console.log('Port close error : ', err);
      process.exit();
    }
    arduinoSerialPort.open(function(err) {
      if (err) {
        console.log('Port open error : ', err);
        process.exit();
      }
      console.log('Serial port is open');
    });
  });
}


