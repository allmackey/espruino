// This method will be called first or hits first  
function doGet(e){
  Logger.log("--- doGet ---");
 
 var addr = "",
     grav = "";
     plat = "";
     hum = "";
     tilt = "";
     temp = "";
     batt = "";
     t = "";
  
  try {
 
    // this helps during debuggin
    if (e == null){e={}; e.parameters = {addr:"-1",grav:"-1",plat:"-1",hum:"-1",tilt:"-1",temp:"-1",batt:"-1",t:"-1"};}
 
    addr = e.parameters.addr;
    grav = e.parameters.grav;
    plat = e.parameters.plat;
    hum = e.parameters.hum;
    tilt = e.parameters.tilt;
    temp = e.parameters.temp;
    batt = e.parameters.batt;
    t = e.parameters.t;
 
    // save the data to spreadsheet
    save_data(addr, grav, plat, hum, tilt, temp, batt, t);
 
 
    return ContentService.createTextOutput("Wrote:\n  addr: " + addr + "\n grav: " + grav +"\n plat: " + plat +"\n  hum: " + hum + "\n  tilt: " + tilt + "\n  temp: " + temp + "\n  batt: " + batt + "\n  t: " + t);
 
  } catch(error) { 
    Logger.log(error);    
    return ContentService.createTextOutput("oops...." + error.message 
                                            + "\n" + new Date() 
                                            + "\nhum: " + hum +
                                            + "\ntemp: " + temp);
  }  
}
 
// Method to save given data to a sheet
function save_data(addr, grav, plat, hum, tilt, temp, batt, t){
  Logger.log("--- save_data ---"); 
 
 
  try {
    var dateTime = new Date();
 
    // Paste the URL of the Google Sheets starting from https thru /edit
    // For e.g.: https://docs.google.com/..../edit 
    var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1uVFsS9xajIYKmmi_caiwd32pTvJpRAcIoVp-V7_bOew/edit");
    var summarySheet = ss.getSheetByName("Summary");
    var dataLoggerSheet = ss.getSheetByName("DataLogger");
    var BatchSheet = ss.getSheetByName("BatchCurrent");
    var BatchSheet1 = ss.getSheetByName("BatchCurrent1");
    var BatchSheet2 = ss.getSheetByName("BatchCurrent2");
    var BatchSheet3 = ss.getSheetByName("BatchCurrent3");
    var BatchSheet4 = ss.getSheetByName("BatchCurrent4");
    var BatchSheet5 = ss.getSheetByName("BatchCurrent5");
    var Devices = ss.getSheetByName("Devices");
    // Get last edited row from DataLogger sheet
    var row = dataLoggerSheet.getLastRow() + 1;
    var d  = Devices.getRange("A1").getValue();
    var d1 = Devices.getRange("A2").getValue();
    var d2 = Devices.getRange("A3").getValue();
    var d3 = Devices.getRange("A4").getValue();
    var d4 = Devices.getRange("A5").getValue();
    var d5 = Devices.getRange("A6").getValue();
    var row0 = BatchSheet.getLastRow() + 1;
    var row1 = BatchSheet1.getLastRow() + 1;
    var row2 = BatchSheet2.getLastRow() + 1;
    var row3 = BatchSheet3.getLastRow() + 1;
    var row4 = BatchSheet4.getLastRow() + 1;
    var row5 = BatchSheet5.getLastRow() + 1;
    // Start Populating the data
    dataLoggerSheet.getRange("A" + row).setValue(row -1); // ID
    dataLoggerSheet.getRange("B" + row).setValue(dateTime); // dateTime
    dataLoggerSheet.getRange("C" + row).setValue(addr); // addr
    dataLoggerSheet.getRange("D" + row).setValue(grav); // grav
    dataLoggerSheet.getRange("E" + row).setValue(plat); // plat
    dataLoggerSheet.getRange("F" + row).setValue(hum); // hum
    dataLoggerSheet.getRange("G" + row).setValue(tilt); // specificGravity
    dataLoggerSheet.getRange("H" + row).setValue(temp); // temprature
    dataLoggerSheet.getRange("I" + row).setValue(batt); // battery
    dataLoggerSheet.getRange("J" + row).setValue(t); // battery
    
    if(d == addr) {
      BatchSheet.getRange("M2").setValue(grav);
      BatchSheet.getRange("B5").setValue(batt);
      BatchSheet.getRange("B6").setValue(temp);
      BatchSheet.getRange("A" + row0).setValue(row0 -26); // ID
      BatchSheet.getRange("B" + row0).setValue(dateTime); // dateTime
      BatchSheet.getRange("C" + row0).setValue(addr); // addr
      BatchSheet.getRange("D" + row0).setValue(grav); // grav
      BatchSheet.getRange("E" + row0).setValue(plat); // plat
      BatchSheet.getRange("F" + row0).setValue(hum); // hum
      BatchSheet.getRange("G" + row0).setValue(tilt); // specificGravity
      BatchSheet.getRange("H" + row0).setValue(temp); // temprature
      BatchSheet.getRange("I" + row0).setValue(batt); // battery
      BatchSheet.getRange("J" + row0).setValue(t); // battery
    }
    if(d1 == addr) {
      BatchSheet1.getRange("M2").setValue(grav);
      BatchSheet1.getRange("B5").setValue(batt);
      BatchSheet1.getRange("B6").setValue(temp);
      BatchSheet1.getRange("A" + row1).setValue(row1 -26); // ID
      BatchSheet1.getRange("B" + row1).setValue(dateTime); // dateTime
      BatchSheet1.getRange("C" + row1).setValue(addr); // addr
      BatchSheet1.getRange("D" + row1).setValue(grav); // grav
      BatchSheet1.getRange("E" + row1).setValue(plat); // plat
      BatchSheet1.getRange("F" + row1).setValue(hum); // hum
      BatchSheet1.getRange("G" + row1).setValue(tilt); // specificGravity
      BatchSheet1.getRange("H" + row1).setValue(temp); // temprature
      BatchSheet1.getRange("I" + row1).setValue(batt); // battery
      BatchSheet1.getRange("J" + row1).setValue(t); // battery
    }
    if(d2 == addr) {
      BatchSheet2.getRange("M2").setValue(grav);
      BatchSheet2.getRange("B5").setValue(batt);
      BatchSheet2.getRange("B6").setValue(temp);
      BatchSheet2.getRange("A" + row2).setValue(row2 -26); // ID
      BatchSheet2.getRange("B" + row2).setValue(dateTime); // dateTime
      BatchSheet2.getRange("C" + row2).setValue(addr); // addr
      BatchSheet2.getRange("D" + row2).setValue(grav); // grav
      BatchSheet2.getRange("E" + row2).setValue(plat); // plat
      BatchSheet2.getRange("F" + row2).setValue(hum); // hum
      BatchSheet2.getRange("G" + row2).setValue(tilt); // specificGravity
      BatchSheet2.getRange("H" + row2).setValue(temp); // temprature
      BatchSheet2.getRange("I" + row2).setValue(batt); // battery
      BatchSheet2.getRange("J" + row2).setValue(t); // battery
    }
    if(d3 == addr) {
      BatchSheet3.getRange("M2").setValue(grav);
      BatchSheet3.getRange("B5").setValue(batt);
      BatchSheet3.getRange("B6").setValue(temp);
      BatchSheet3.getRange("A" + row3).setValue(row3 -26); // ID
      BatchSheet3.getRange("B" + row3).setValue(dateTime); // dateTime
      BatchSheet3.getRange("C" + row3).setValue(addr); // addr
      BatchSheet3.getRange("D" + row3).setValue(grav); // grav
      BatchSheet3.getRange("E" + row3).setValue(plat); // plat
      BatchSheet3.getRange("F" + row3).setValue(hum); // hum
      BatchSheet3.getRange("G" + row3).setValue(tilt); // specificGravity
      BatchSheet3.getRange("H" + row3).setValue(temp); // temprature
      BatchSheet3.getRange("I" + row3).setValue(batt); // battery
      BatchSheet3.getRange("J" + row3).setValue(t); // battery
    }
    if(d4 == addr) {
      BatchSheet4.getRange("M2").setValue(grav);
      BatchSheet4.getRange("B5").setValue(batt);
      BatchSheet4.getRange("B6").setValue(temp);
      BatchSheet4.getRange("A" + row4).setValue(row4 -26); // ID
      BatchSheet4.getRange("B" + row4).setValue(dateTime); // dateTime
      BatchSheet4.getRange("C" + row4).setValue(addr); // addr
      BatchSheet4.getRange("D" + row4).setValue(grav); // grav
      BatchSheet4.getRange("E" + row4).setValue(plat); // plat
      BatchSheet4.getRange("F" + row4).setValue(hum); // hum
      BatchSheet4.getRange("G" + row4).setValue(tilt); // specificGravity
      BatchSheet4.getRange("H" + row4).setValue(temp); // temprature
      BatchSheet4.getRange("I" + row4).setValue(batt); // battery
      BatchSheet4.getRange("J" + row4).setValue(t); // battery
    }
    if(d5 == addr) {
      BatchSheet5.getRange("M2").setValue(grav);
      BatchSheet5.getRange("B5").setValue(batt);
      BatchSheet5.getRange("B6").setValue(temp);
      BatchSheet5.getRange("A" + row5).setValue(row5 -26); // ID
      BatchSheet5.getRange("B" + row5).setValue(dateTime); // dateTime
      BatchSheet5.getRange("C" + row5).setValue(addr); // addr
      BatchSheet5.getRange("D" + row5).setValue(grav); // grav
      BatchSheet5.getRange("E" + row5).setValue(plat); // plat
      BatchSheet5.getRange("F" + row5).setValue(hum); // hum
      BatchSheet5.getRange("G" + row5).setValue(tilt); // specificGravity
      BatchSheet5.getRange("H" + row5).setValue(temp); // temprature
      BatchSheet5.getRange("I" + row5).setValue(batt); // battery
      BatchSheet5.getRange("J" + row5).setValue(t); // battery
    }
 
    // Update summary sheet
    summarySheet.getRange("B1").setValue(dateTime); // Last modified date
    // summarySheet.getRange("B2").setValue(row - 1); // Count 
  }
 
  catch(error) {
    Logger.log(JSON.stringify(error));
  }
 
  Logger.log("--- save_data end---"); 
}
