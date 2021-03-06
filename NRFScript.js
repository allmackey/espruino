var b = digitalRead(D25);
var i2c = new I2C();
i2c.setup({ scl : D30, sda: D31 });
var acc = require("https://github.com/allmackey/espruino/blob/master/KX022.js").connectI2C(i2c);
acc.init();
var ic = 1;
var i = 0;
var xL = 0;
var xH = 0;
var yL = 0;
var yH = 0;
var zL = 0;
var zH = 0;
var xP = 0;
var yP = 0;
var zP = 0;
var xLOld = 0;
var xHOld = 0;
var yLOld = 0;
var yHOld = 0;
var zLOld = 0;
var zHOld = 0;
var cnt = 0;
var batt = Math.round(NRF.getBattery()*1000);
var i = 0;
var sht =  require("https://github.com/allmackey/espruino/blob/master/SHT3.js").connect(i2c,0x44);
var tH = 0;
var tL = 0;
var hH = 0;
var hL = 0;

var t = setInterval(function () {
  b = digitalRead(D25);
  if(b==0) {
    digitalWrite(D26, 1);
    reset(true);
  }
  xL = acc.read().xL;
  xH = acc.read().xH;
  yL = acc.read().yL;
  yH = acc.read().yH;
  zL = acc.read().zL;
  zH = acc.read().zH;
  xP = acc.read().xP;
  yP = acc.read().yP;
  zP = acc.read().zP;
 /*   i = 0;
  for(i=0; i<ic; i++) {
    xL = xL + acc.read().xL;
    xH = xH + acc.read().xH;
    yL = yL + acc.read().yL;
    yH = yH + acc.read().yH;
    zL = zL + acc.read().zL;
    zH = zH + acc.read().zH;
  }*/
  xL = Math.round(xL/ic);
  xH = Math.round(xH/ic);
  yL = Math.round(yL/ic);
  yH = Math.round(yH/ic);
  zL = Math.round(zL/ic);
  zH = Math.round(zH/ic);
  batt = Math.round(NRF.getBattery()*1000);
  /*print(batt);
  print(xL);
  print(xH);
  print(yL);
  print(yH);
  print(zL);
  print(zH);*/

  tH = sht.readData().tH;
  tL = sht.readData().tL;
  hH = sht.readData().hH;
  hL = sht.readData().hL;
  require("https://github.com/allmackey/espruino/blob/master/BrewBeacon.js").advertise({
  uuid : [0, 0, 0, zP, yP, xP, tH, tL, hH, hL, xL, xH, yL, yH, zL, zH], // ibeacon uuid
  major : batt, // optional
  minor : 0x0001, // optional
  rssi : -59, // optional RSSI at 1 meter distance in dBm
  manufacturer:0x0001
});
  if((xL==xLOld) && (xH==xHOld) && (yL==yLOld) && (yH==yHOld) && (zL==zLOld) && (zH==zHOld)) {
    if(cnt >= 2) {
      acc.init();
      cnt = 0;
    }
    cnt++;
  } else {
    cnt = 0; 
  }
  xLOld = xL;
  xHOld = xH;
  yLOld = yL;
  yHOld = yH;
  zLOld = zL;
  zHOld = zH;
  //print(tH);
  //print(tL);
  //print(hH);
  //print(hL);
}, 30000);
