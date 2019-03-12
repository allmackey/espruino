/* Copyright (c) 2017 Uri Shaked, released under the MIT license */

/* Module for SHT20/21/25 Humidity and Temperature Sensor IC */

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
  print("v2");
  print(this.addr);
  this.i2c.writeTo(this.addr, [0x2c, 0x06]);
  var result = this.i2c.readFrom(this.addr, 3);
  var value = (result[0] << 8) | (result[1] & ~0x03);
  print(result);
  this.checkCrc(result, 2, result[2]);
  if (!value) {
    return null;
  }
  return -49 + 315 / 65535.0 * value;
};

SHT2x.prototype.readHumidity = function() {
  this.i2c.writeTo(this.addr, [0x2c, 0x06]);
  var result = this.i2c.readFrom(this.addr, 6);
  var value = (result[3] << 8) | (result[4] & ~0x03);
  print(result);
  //this.checkCrc(result, 2, result[5]);
  if (!value) {
    return null;
  }
  return  100 / 65535.0 * value;
};
