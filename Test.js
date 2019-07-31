var b = digitalRead(D25);
/*var i2c = new I2C();
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
var hL = 0;*/
var eq1l = 0;
var equ2l= 0;

NRF.setServices({
  0xFFFF : {
    0xFFF0 : {
      writable : true,
      onWrite : function(evt) {
        if(evt.data[0]) {
          b = digitalRead(D25);
          if(b==0) {
            digitalWrite(D26, 1);
            reset(true);
          }
        }
      }
    },
    0xFFF1 : {
      readable : true,
      writable : true,
      value : "-1.086956522",
      onWrite : function(evt) {
        var eq1 = evt.data[0]; 
        require("Storage").write(".boot0", `eq1 = evt.data[0]; eq2 = eq2l`);
      }
    },
    0xFFF2 : {
      readable : true,
      writable : true,
      value : "-1.086956522",
      onWrite : function(evt) {
        var eq1 = evt.data[0]; 
        require("Storage").write(".boot0", eq1 = eq1l);
      }
    }
  }
},{ advertise: [ 'FFFF' ] });
