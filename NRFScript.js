var t = setInterval(function () {
  // set up I2C
  var i2c = new I2C();
  i2c.setup({ scl : D30, sda: D31 });
  var acc = require("https://github.com/allmackey/espruino/blob/master/KX022.js").connectI2C(i2c);
  //print(acc.read()); // prints { x: ..., y: ..., z: ... }
  var ic = 75;
  var i = 0;
  var xL = acc.read().xL;
  var xH = acc.read().xH;
  var yL = acc.read().yL;
  var yH = acc.read().yH;
  var zL = acc.read().zL;
  var zH = acc.read().zH;
  for(i=0; i<ic; i++) { 
    xL = xL + acc.read().xL;
    xH = xH + acc.read().xH;
    yL = yL + acc.read().yL;
    yH = yH + acc.read().yH;
    zL = zL + acc.read().zL;
    zH = zH + acc.read().zH;
  }
  xL = Math.round(xL/ic);
  xH = Math.round(xH/ic);
  yL = Math.round(yL/ic);
  yH = Math.round(yH/ic);
  zL = Math.round(zL/ic);
  zH = Math.round(zH/ic);
  var batt = Math.round(NRF.getBattery()*1000);
  print(batt);
  print(xL);
  print(xH);
  print(yL);
  print(yH);
  print(zL);
  print(zH);
  
  var sht =  require("https://github.com/allmackey/espruino/blob/master/SHT3.js").connect(i2c,0x44);
  var tH = sht.readData().tH;
  var tL = sht.readData().tL;
  var hH = sht.readData().hH;
  var hL = sht.readData().hL;
  print(tH);
  print(tL);
  print(hH);
  print(hL);
  
  require("https://github.com/allmackey/espruino/blob/master/BrewBeacon.js").advertise({
    uuid : [0, 0, 0, 0, 0, 0, tH, tL, hH, hL, xL, xH, yL, yH, zL, zH], // ibeacon uuid
    major : batt, // optional
    minor : 0x0001, // optional
    rssi : -59, // optional RSSI at 1 meter distance in dBm
    manufacturer:0x0001
  });
}, 10000);
//ffff0215000000000000615342c731034303670f0cbe0001c5 
//clearInterval(t);
//http://www.espruino.com/binaries/travis/master/ 
//curl http://www.espruino.com/binaries/travis/master/espruino_2v01.70_nrf52832.hex -o bootloaderNRF2v01.70.hex
