var i2c = new I2C();
i2c.setup({ scl : D30, sda: D31 });
var acc = require("https://github.com/allmackey/espruino/blob/master/KX022.js").connectI2C(i2c);
var ic = 75;
var i = 0;
var xL = 0;
var xH = 0;
var yL = 0;
var yH = 0;
var zL = 0;
var zH = 0;
var batt = Math.round(NRF.getBattery()*1000);
var ic = 75;
var i = 0;
var sht =  require("https://github.com/allmackey/espruino/blob/master/SHT3.js").connect(i2c,0x44);
var tH = 0;
var tL = 0;
var hH = 0;
var hL = 0;
var nrfHandle = require("https://github.com/allmackey/espruino/blob/master/BrewBeacon.js").advertise({
  uuid : [0, 0, 0, 0, 0, 0, tH, tL, hH, hL, xL, xH, yL, yH, zL, zH], // ibeacon uuid
  major : batt, // optional
  minor : 0x0001, // optional
  rssi : -59, // optional RSSI at 1 meter distance in dBm
  manufacturer:0x0001
});

var t = setInterval(function () {
  xL = acc.read().xL;
  xH = acc.read().xH;
  yL = acc.read().yL;
  yH = acc.read().yH;
  zL = acc.read().zL;
  zH = acc.read().zH;
    i = 0;
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
  batt = Math.round(NRF.getBattery()*1000);
  print(batt);
  print(xL);
  print(xH);
  print(yL);
  print(yH);
  print(zL);
  print(zH);

  tH = sht.readData().tH;
  tL = sht.readData().tL;
  hH = sht.readData().hH;
  hL = sht.readData().hL;
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
