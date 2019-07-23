var b = digitalRead(D25);
var i2c = new I2C();
i2c.setup({ scl : D30, sda: D31 });
var acc = require("https://github.com/allmackey/espruino/blob/master/KX022.js").connectI2C(i2c);
acc.init();
var i = 0;
var tilt = 0;

var t = setInterval(function () {
  b = digitalRead(D25);
  if(b==0) {
    digitalWrite(D26, 1);
    reset(true);
  }
  tilt = acc.read().tilt;
  i = 0;
  ic = 50;
  for(i=0; i<ic; i++) {
    tilt = tilt + acc.read().tilt;
  }
  tilt = tilt/ic;
  print(tilt);
}, 5000);
