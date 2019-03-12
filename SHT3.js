/* Copyright (c) 2017 Uri Shaked, released under the MIT license */

/* Module for SHT20/21/25 Humidity and Temperature Sensor IC */

var C = {
  ADDR: 0x44,
  POLYNOMIAL: 0x131
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
      crc = (crc & 0x80) ? ((crc << 1) ^ C.POLYNOMIAL) : (crc << 1);
    }
  }
  if (crc !== checksum) {
    throw "CRC Error";
  }
};

SHT2x.prototype.readTemperature = function() {
  print("v1");
  print(this.addr);
  //var t=getTime()+1000;
  //while(getTime()<t);
  this.i2c.writeTo(this.addr, 0xe3);
  var result = this.i2c.readFrom(this.addr, 3);
  var value = (result[0] << 8) | (result[1] & ~0x03);
  //this.checkCrc(result, 2, result[2]);
  if (!value) {
    return null;
  }
  return -49.0 + 315.0 / 65535.0 * value;
};

SHT2x.prototype.readHumidity = function() {
  this.i2c.writeTo(this.addr, 0xe5);
  var result = this.i2c.readFrom(this.addr, 3);
  var value = (result[0] << 8) | (result[1] & ~0x03);
  //this.checkCrc(result, 2, result[2]);
  if (!value) {
    return null;
  }
  return  100.0 / 65535.0 * value;
}; 
