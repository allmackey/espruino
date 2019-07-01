/* Written by Allen Mackey */
//Espruino code
//var i2c = new I2C();
//i2c.setup({ scl : D30, sda: D31 });
//var acc = require("https://github.com/allmackey/espruino/blob/master/KX022.js").connectI2C(i2c);
//print(acc.read()); // prints { x: ..., y: ..., z: ... }

var REG = { 
  WHO_AM_I: 0x0F,
  OUTX_L: 0x06,
  OUTX_H: 0x07,
  OUTY_L: 0x08,
  OUTY_H: 0x09,
  OUTZ_L: 0x0A,
  OUTZ_H: 0x0B,
  CNTL1: 0x18,
  CNTL3: 0x1A,
  ODCNTL: 0x1B,
  SLAVE: 0x1E,
  WAI_VAL: 0x14,
  LP_CNTL: 0x35,
};

//tt
function LIS2MDL(options,r,w) {
  this.r = r;
  this.w = w;
  if (this.r(REG.WHO_AM_I,1)[0]!=20) throw new Error("WHO_AM_I incorrect");
  // Temp compensation, 10Hz continuous readings
  //this.w(REG.CNTL1, 0x50); //config 0 1 0 1 0 0 0 0 OLD
  //this.w(REG.CNTL1, 0x10); //config 0 0 0 1 0 0 0 0 NEW
  //this.w(REG.CNTL1, 0xD0); //OLD
  //this.w(REG.LP_CNTL, 0x0B); //NEW
  //this.w(REG.CNTL1, 0x90); //NEW config 10010000
  // low pass filter, ODR/4
  //this.w(REG.CFG_B, 0x01);
  // data ready irq, block data read
  //this.w(REG.CFG_C, 0x11);
}

//tt
LIS2MDL.prototype.init = function() {
  this.w(REG.CNTL1, 0x10); //config 0 0 0 1 0 0 0 0 NEW
  //this.w(REG.CNTL1, 0xD0); //OLD
  this.w(REG.LP_CNTL, 0x0B); //NEW
  this.w(REG.CNTL1, 0x90); //NEW config 10010000
};

//tt
LIS2MDL.prototype.read = function() {
  var d = new DataView(this.r(REG.OUTX_L,6).buffer);
  return {
    x:  d.getInt16(0,1),
    y:  d.getInt16(2,1),
    z:  d.getInt16(4,1),
    xL: d.getInt8(0,1),
    yL: d.getInt8(2,1),
    zL: d.getInt8(4,1),
    xH: d.getInt8(1,1),
    yH: d.getInt8(3,1),
    zH: d.getInt8(5,1)
  };
  
  LIS2MDL.prototype.readcntr = function() {
  var d = new DataView(this.r(REG.CNTL1,1).buffer);
  return {
    res:  d.getInt8(0,1),
  };
};
exports.LIS2MDL = LIS2MDL;

exports.connectI2C = function(i2c, options) {
  var a = (options&&options.addr)||30;
  return (new LIS2MDL(options, function(reg, len) { // read
    i2c.writeTo(a, reg);
    return i2c.readFrom(a, len);
  }, function(reg, data) { // write
    i2c.writeTo(a, [reg, data]); 
  }));
};
