/* Module for SHT3x Humidity and Temperature Sensor IC */

var C = {
  ADDR: 0x40,
  POLYNOMIAL: 0x31
};

exports.connect = function (_i2c,_addr) {
  return new SHT2x(_i2c,_addr);
};

function SHT2x(_i2c, _addr) {
  this.i2c = _i2c;
  this.addr = _addr || C.ADDR;
}

SHT2x.prototype.checkCrc = function(bytes, bytesLen, checksum) {
  var crc = 0;
  for (var i = 0; i < bytesLen; i++) {
    crc ^= bytes[i];
    for (var bit = 8; bit > 0; --bit) {
      if (crc & 0x80) {
        crc = ((crc << 1) ^ C.POLYNOMIAL);
      } else {
        (crc << 1);
      }
    }
  }
  if (crc !== checksum) {
    throw "CRC Error";
  }
};

SHT2x.prototype.readTemperature = function() {
  print("v5");
  print(this.addr);
  this.i2c.writeTo(this.addr, [0x2c, 0x06]);
  var result = this.i2c.readFrom(this.addr, 3);
  var t = (result[0] << 8) | (result[1] & ~0x03);
  var h = (result[3] << 8) | (result[4] & ~0x03);
  print(result);
  //this.checkCrc(result, 2, result[2]);
  var d = new DataView(this.i2c.readFrom(this.addr,6).buffer);
  return {
    tH: d.getInt8(0,1),
    tL: d.getInt8(1,1),
    hH: d.getInt16(3,1),
    hL: d.getInt8(4,1),
    tfV: -49.0 + 315.0 / 65535.0 * t,
    hfV: 100.0 / 65535.0 * h
  };
};
