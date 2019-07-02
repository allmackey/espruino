#include <WiFi.h>
#include <DNSServer.h>
#include <WiFiManager.h>
//#include <ArduinoOTA.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include "tinyexpr.h"
#include <WiFiClientSecure.h>
#include "esp_system.h"

const char* host = "script.google.com"; 
const char* fingerprint = "DA 5C 50 06 98 6D 61 3F C5 D0 0E C6 68 AE CD D3 86 B0 D5 6B";

const char* ssid = "FitzMack";
const char* password = "32mansfield";

#define HOSTNAME "BrewMeter-OTA-"
boolean conn = false, recentScan = false;
boolean stringComplete = false;
String inputString = "";
int scanTime = 16, mqqtOn=1, cnt = 0, storeV = 0, storeT = 5; //In seconds
BLEScan* pBLEScan;
BLEAdvertisedDevice advertisedDevice;

// The ID below comes from Google Sheets. 
// Towards the bottom of this page, it will explain how this can be obtained 
const char *GScriptId = "AKfycbwOuhwCnaZBXrncSYUMbCGeuEOFeK0dMcahpPF0F7M9xNRU3VuS"; //Steve's
//AKfycbxaQ7klZBiAEHHGc19LGqfwBzwHKaYVoi8VrrQvbA //newsheet
//AKfycbyEqh_onXnIHvvMp1-UUVKx8-fvfzdIRK9Xj6hnzz2vKZTmcdU //oldsheet

float pi = 3.141592653589793238462643383279502884f;
char my_polynominal[70] = "-0.00031*tilt^2+0.557*tilt-14.054";
float temp;    // Stores the real internal chip temperature in degrees Celsius
float Volt, Temperatur, Tilt, Gravity;
int num_of_meters = 0, indx = 0, scanning = 1;

// Prepare the url (without the varying data) 
String url = String("/macros/s/") + GScriptId + "/exec?";

typedef struct {
  String addr_s;
  float grav_s;
  float plat_s;
  float hum_s;
  float Tilt_s;
  float temp_s;
  float batt_s;
  int t;
}brew_meter_list;

brew_meter_list bml[] = {
  {"00:00:00:00:00:00",0.0,0.0,0.0,0.0,0.0,0.0,0},
  {"00:00:00:00:00:00",0.0,0.0,0.0,0.0,0.0,0.0,0},
  {"00:00:00:00:00:00",0.0,0.0,0.0,0.0,0.0,0.0,0},
  {"00:00:00:00:00:00",0.0,0.0,0.0,0.0,0.0,0.0,0},
  {"00:00:00:00:00:00",0.0,0.0,0.0,0.0,0.0,0.0,0},
  {"00:00:00:00:00:00",0.0,0.0,0.0,0.0,0.0,0.0,0}
};

unsigned long currentMillis=0;
unsigned long previousMillis = 0;
long int interval = 1000*60;
unsigned long previousMillis_t = 0;

int parseData(String strdata, String addr, int index);
int checkID(String address);

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      //Serial.printf("Advertised Device: %s \n", advertisedDevice.toString().c_str());
      String strData = String(BLEUtils::buildHexData(nullptr, (uint8_t*)advertisedDevice.getManufacturerData().data(), advertisedDevice.getManufacturerData().length()));
      String BLEData = strData.substring(0,4);
      if(BLEData.substring(0,4) == "ffff") {
        String addrs = String(advertisedDevice.getAddress().toString().c_str());
        //Serial.println(addr);
        //Serial.println(strdata);
        indx = checkID(addrs);
        Serial.print(indx);
        Serial.print(": ");
        Serial.println(bml[indx].addr_s);
        int resl = parseData(strData, addrs, indx);
      }
    }
};

void AdvComplete(BLEScanResults res)
{
  Serial.println("scan complete...");
  Serial.println(res.getCount());
  pBLEScan->clearResults();
  delay(500);
  Serial.print("scanTime = ");
  Serial.println(scanTime);
  if (scanning){
    pBLEScan->start(scanTime, AdvComplete,false);
  }
  Serial.println("Scan Started");
}

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    WiFiManager wifiManager;
    wifiManager.autoConnect();
         
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    BLEDevice::init("");
    pBLEScan = BLEDevice::getScan(); //create new scan
    pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(), false);
    pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);  // less or equal setInterval value 
    pBLEScan->start(scanTime, AdvComplete,false);
}

void loop() {
  //Serial.println("do nothing");
  //BLEScanResults foundDevices = 
  currentMillis = millis();
  if (currentMillis - previousMillis >= interval)
  {
      previousMillis = currentMillis;
      scanning = 0;
      pBLEScan->BLEScan::stop();
      pBLEScan->clearResults();
      Serial.println("Scan Stopped");
      for(int i=0; i<num_of_meters; i++) {
        String grav_str = String(bml[i].grav_s,3);
        String plat_str = String(bml[i].plat_s,3);
        String Tilt_str = String(bml[i].Tilt_s,3);
        String Batt_str = String(bml[i].batt_s,3);
        String liveData = "addr=" + bml[i].addr_s + "&grav=" + grav_str + "&plat=" + plat_str +"&hum=" + bml[i].hum_s + "&tilt=" + bml[i].Tilt_s + "&temp=" + bml[i].temp_s + "&batt=" + Batt_str + "&t=" + bml[i].t;
        postData(liveData);
        bml[i].t = bml[i].t + 1;
      } 
      scanning = 1;
      pBLEScan->start(scanTime, AdvComplete,false);
      Serial.println("Scan Started");
  }
  serialEvent();
  serialResponse();
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    cnt++;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

void serialResponse () {
  if (stringComplete) {
    //Serial.println(inputString);
    if (inputString == "SetOn\r\n") {
      Serial.println("Data Record On");
      mqqtOn = 1;
    }
    if (inputString == "SetOff\r\n") {
      Serial.println("Data Record Off");
      mqqtOn = 0;
    }
  stringComplete = false;
  inputString = "";
  cnt = 0;
  }
}

int checkID(String address){
  int index = -1;
  for(int i=0; i<6; i++) {
    if(bml[i].addr_s == address){
      index = i;
    }
  }
  if(index == -1){
    if (num_of_meters == 6){
      num_of_meters = 5;
    }
    index = num_of_meters;
    bml[index].addr_s = address;
    num_of_meters++;
  }
  return index;
}

int parseData(String strdata, String addr, int index) {
  String rssi = strdata.substring(48,50);
  String minor = strdata.substring(44,48);
  String majorBatt = strdata.substring(40,44);
  String zH = strdata.substring(38,40);
  String zL = strdata.substring(36,38);
  String yH = strdata.substring(34,36);
  String yL = strdata.substring(32,34);
  String xH = strdata.substring(30,32);
  String xL = strdata.substring(28,30);
  String hL = strdata.substring(26,28);
  String hH = strdata.substring(24,26);
  String tL = strdata.substring(22,24);
  String tH = strdata.substring(20,22);
         
  String tempstr = tH+tL;
  String humstr = hH + hL;
   //[0, 0, 0, 0, 0, 0, tH, tL, hH, hL, xL, xH, yL, yH, zL, zH]
  temp = -49.0 + 315.0 / 65535.0 * strtol(tempstr.c_str(), NULL, 16);
  float hum = 100.0 / 65535.0 * strtol(humstr.c_str(), NULL, 16);
  String xstr = xH + xL;
  String ystr = yH + yL;
  String zstr = zH + zL;
  float batt = strtol(majorBatt.c_str(), NULL, 16)/1000.0;
  signed long int x = strtol(xstr.c_str(), NULL, 16);
  if (x > 0x7fff)
      x -= 0x10000;
  signed long int y = strtol(ystr.c_str(), NULL, 16);
  if (y > 0x7fff)
      y -= 0x10000;
  signed long int z = strtol(zstr.c_str(), NULL, 16);
  float pitch = (atan2(y, sqrt(x * x + z * z))) * 180.00 / pi;
  float roll = (atan2(x, sqrt(y * y + z * z))) * 180.00 / pi;
  Tilt =  sqrt(pitch * pitch + roll * roll);
  Gravity = calculateGravity();
  float SG = 1 + (Gravity / (258.60 - ( (Gravity/258.20) *227.10) ) );

  bml[index] = {addr, SG, Gravity, hum, Tilt, temp, batt, 1};
  Serial.print("BrewMeter Update: ");
  Serial.print(addr);
  Serial.print(",");
  Serial.print(SG,3);
  Serial.print(",");
  Serial.print(Gravity,3);
  Serial.print(",");
  Serial.print(hum,3);
  Serial.print(",");
  Serial.print(Tilt,3);
  Serial.print(",");
  Serial.print(temp,3);
  Serial.print(",");
  Serial.print(batt,3);
  Serial.print(",");
  Serial.println(1);
return 1;
}

float calculateGravity()
{
  double _tilt = Tilt;
  double _temp = temp;
  float _gravity = 0;
  int err;
  te_variable vars[] = {{"tilt", &_tilt}, {"temp", &_temp}};
  te_expr *expr = te_compile(my_polynominal, vars, 2, &err);
  if (expr)
  {
    _gravity = te_eval(expr);
    te_free(expr);
  }
  else
  {
    Serial.println(String(F("Parse error at ")) + err);
  }
  return _gravity;
}

void postData(String dataString){ 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());
  WiFiClientSecure client;
  const int httpPort = 443;
  int cnt = 0;
  while (!client.connect(host, httpPort)) {
    Serial.println("connection failed!");
    Serial.println("Trying again!!");
    if(cnt == 5){
      esp_restart();
    }
    cnt++;
  }

  //url = "/macros/s/AKfycbwOuhwCnaZBXrncSYUMbCGeuEOFeK0dMcahpPF0F7M9xNRU3VuS/exec?lux=0&range=0&tilt=0&temp=0&batt=3.30";
  Serial.print("Requesting URL: ");
  
  String url_d = url+dataString;
  Serial.println(url_d);

  client.print(String("GET ") + url_d + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(500);
  String section="header";
  while(client.available())
  {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  Serial.println();
  Serial.println("closing connection");
  client.stop();
  delay(100);
}
