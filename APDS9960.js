// Write to I2C
APDS9960.prototype.w = function (r, d) { ... }

// Read from I2C
APDS9960.prototype.r = function (r) { ... }

// Check if there has been a gesture recorded or not
APDS9960.prototype.hasGesture = function () { ... }

// Return the current gesture (left/right/up/down) or 'undefined' is none
APDS9960.prototype.getGesture = function () { ... }

// Given an array of UDLRUDLRUDLR... bytes, return a gesture as a string
APDS9960.prototype.decodeGesture = function (data) { ... }

// return a reading from the proximity sensor, 0..255
APDS9960.prototype.getProximity = function () { ... }

// red/green/blue/ambient returned as {r,g,b,a} in the range 0..65535
APDS9960.prototype.getRGBA = function () { ... }

function (i2c) { ... }

exports.connect = function (i2c) { ... }
