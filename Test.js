var b = digitalRead(D25);
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
      notify: true,
      value : f,
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
