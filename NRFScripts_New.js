//var b = digitalRead(D25);
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
var Tilt = 0;
var plato = 0;
var SG = 0;
var SGH = 0;
var SGL = 0;
var SGLH = 0;
var SGLL = 0;
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

var eq1l = -1.08695653;
var eq2l= 60.52173913;
var eq1 = parseFloat(require("Storage").read("eq1"));
var eq2 = parseFloat(require("Storage").read("eq2"));
var f = 0;
var EVNT = 0;
if(isNaN(eq1) == 1) {
  eq1 = eq1l;
}
if(isNaN(eq2) == 1) {
  eq2 = eq2l;
}

NRF.setServices({
  0xFFFF : {
    0xFFF0 : {
      writable : true,
      onWrite : function(evt) {
        //if(evt.data[0]) {
        var kl = 0;
          digitalWrite(D26, 1);
        for (var n = 0; n < 6000; n++) {
		     kl += 1;
	    }
          reset(true);
        //}
      }
    },
    0xFFF1 : {
      readable : true,
      writable : true,
      notify: true,
      value : f,
      maxLen : 20,
      onWrite : function(evt) {
        var eq1s = hex_to_ascii(evt.data);
        eq1 = parseFloat(eq1s);
        f = require("Storage").write("eq1", eq1s,0,20);
      }
    },
    0xFFF2 : {
      readable : true,
      writable : true,
      notify: true,
      value : f,
      maxLen : 20,
      onWrite : function(evt) {
        var eq2s = hex_to_ascii(evt.data);
        eq2 = parseFloat(eq2s);
        f = require("Storage").write("eq2", eq2s,0,20);
      }
    }
  }
},{ advertise: [ 'FFFF' ] });

function hex_to_ascii(str1)
 {
	//var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < str1.length; n++) {
		str += String.fromCharCode(str1[n]);
	}
	return str;
 }

var t = setInterval(function () {
  /*b = digitalRead(D25);
  if(b==0) {
    digitalWrite(D26, 1);
    reset(true);
  }*/
  xL = acc.read().xL;
  xH = acc.read().xH;
  yL = acc.read().yL;
  yH = acc.read().yH;
  zL = acc.read().zL;
  zH = acc.read().zH;
  xP = acc.read().xP;
  yP = acc.read().yP;
  zP = acc.read().zP;
  Tilt = acc.read().tilt;
  plato = eq1*Tilt+eq2;
  SG = 1 + (plato / (258.60 - ( (plato/258.20) *227.10) ) );
  if (SG >= 1) {
    SGH = 1;
  } else {
     SGH = 0;
  }
  SGL = parseInt((SG.toString()).substring(2, 5));
  SGLL =SGL & 0xff;
  SGLH= (SGL >> 8);
  print(SG);
  print(SGH);
  print(SGL);
  print(SGLH);
  print(SGLL);
  tH = sht.readData().tH;
  tL = sht.readData().tL;
  hH = sht.readData().hH;
  hL = sht.readData().hL;
  require("https://github.com/allmackey/espruino/blob/master/BrewBeacon.js").advertise({
  uuid : [SGH, SGLH, SGLL, zP, yP, xP, tH, tL, hH, hL, xL, xH, yL, yH, zL, zH], // ibeacon uuid
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
