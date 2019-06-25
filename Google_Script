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
 
  try {
 
    // this helps during debuggin
    if (e == null){e={}; e.parameters = {addr:"-1",grav:"-1",plat:"-1",hum:"-1",tilt:"-1",temp:"-1",batt:"-1"};}
 
    addr = e.parameters.addr;
    grav = e.parameters.grav;
    plat = e.parameters.plat;
    hum = e.parameters.hum;
    tilt = e.parameters.tilt;
    temp = e.parameters.temp;
    batt = e.parameters.batt;
 
    // save the data to spreadsheet
    save_data(addr, grav, plat, hum, tilt, temp, batt);
 
 
    return ContentService.createTextOutput("Wrote:\n  addr: " + addr + "\n grav: " + grav +"\n plat: " + plat +"\n  hum: " + hum + "\n  tilt: " + tilt + "\n  temp: " + temp + "\n  batt: " + batt);
 
  } catch(error) { 
    Logger.log(error);    
    return ContentService.createTextOutput("oops...." + error.message 
                                            + "\n" + new Date() 
                                            + "\nhum: " + hum +
                                            + "\ntemp: " + temp);
  }  
}
 
// Method to save given data to a sheet
function save_data(addr, grav, plat, hum, tilt, temp, batt){
  Logger.log("--- save_data ---"); 
 
 
  try {
    var dateTime = new Date();
 
    // Paste the URL of the Google Sheets starting from https thru /edit
    // For e.g.: https://docs.google.com/..../edit 
    var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1uVFsS9xajIYKmmi_caiwd32pTvJpRAcIoVp-V7_bOew/edit");
    var summarySheet = ss.getSheetByName("Summary");
    var dataLoggerSheet = ss.getSheetByName("DataLogger");
 
 
    // Get last edited row from DataLogger sheet
    var row = dataLoggerSheet.getLastRow() + 1;
 
 
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
 
 
    // Update summary sheet
    summarySheet.getRange("B1").setValue(dateTime); // Last modified date
    // summarySheet.getRange("B2").setValue(row - 1); // Count 
  }
 
  catch(error) {
    Logger.log(JSON.stringify(error));
  }
 
  Logger.log("--- save_data end---"); 
}
