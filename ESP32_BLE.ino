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
int scanTime = 60, mqqtOn=1, cnt = 0; //In seconds
BLEScan* pBLEScan;
BLEAdvertisedDevice advertisedDevice;

// The ID below comes from Google Sheets. 
// Towards the bottom of this page, it will explain how this can be obtained 
const char *GScriptId = "AKfycbwOuhwCnaZBXrncSYUMbCGeuEOFeK0dMcahpPF0F7M9xNRU3VuS"; 

static int error_count = 0;
static int connect_count = 0;
const unsigned int MAX_CONNECT = 20;
static bool flag = false;
float pi = 3.141592653589793238462643383279502884f;
char my_polynominal[70] = "-0.00031*tilt^2+0.557*tilt-14.054";
float temp;    // Stores the real internal chip temperature in degrees Celsius
float Volt, Temperatur, Tilt, Gravity;

// Prepare the url (without the varying data) 
String url = String("/macros/s/") + GScriptId + "/exec?";

//1uVFsS9xajIYKmmi_caiwd32pTvJpRAcIoVp-V7_bOew
//https://script.google.com//macros/s/AKfycbwOuhwCnaZBXrncSYUMbCGeuEOFeK0dMcahpPF0F7M9xNRU3VuS/exec?addr=db:ee:5f:6f:74:84&grav=-0.16&hum=38.51&tilt=25.30&temp=76.43&batt=2.00
//                           /macros/s/AKfycbwOuhwCnaZBXrncSYUMbCGeuEOFeK0dMcahpPF0F7M9xNRU3VuS/exec?lux=0&range=0&tilt=0&temp=0&batt=3.30


unsigned long currentMillis=0;
unsigned long previousMillis = 0;
long int interval = 1000*10;
unsigned long previousMillis_t = 0;

void setup() {
    Serial.begin(115200);
    WiFiManager wifiManager;
    wifiManager.autoConnect();
     // OTA Setup
    /*ArduinoOTA.onStart([]() {
      String type;
      if (ArduinoOTA.getCommand() == U_FLASH) {
        type = "sketch";
      } else { // U_SPIFFS
        type = "filesystem";
      }
      // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
      Serial.println("Start updating " + type);
    });
    ArduinoOTA.onEnd([]() {
      Serial.println("\nEnd");
    });
    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    });
    ArduinoOTA.onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) {
        Serial.println("Auth Failed");
      } else if (error == OTA_BEGIN_ERROR) {
        Serial.println("Begin Failed");
      } else if (error == OTA_CONNECT_ERROR) {
        Serial.println("Connect Failed");
      } else if (error == OTA_RECEIVE_ERROR) {
        Serial.println("Receive Failed");
      } else if (error == OTA_END_ERROR) {
        Serial.println("End Failed");
      }
    });
    ArduinoOTA.begin();*/
    
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    BLEDevice::init("");
    pBLEScan = BLEDevice::getScan(); //create new scan
    pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
    pBLEScan->setInterval(100);
    pBLEScan->setWindow(99);  // less or equal setInterval value 
}

void loop() {
  //ArduinoOTA.handle();
  currentMillis = millis();
  if (currentMillis - previousMillis >= interval)
  {
      previousMillis = currentMillis;
      processData();  
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

void processData() {
    BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
    for (int i=0; i<foundDevices.getCount(); i++) {
      String strdata = String(BLEUtils::buildHexData(nullptr, (uint8_t*)foundDevices.getDevice(i).getManufacturerData().data(), foundDevices.getDevice(i).getManufacturerData().length()));
      String BLEData = strdata.substring(0,4);
      if(BLEData.substring(0,4) == "ffff") {
        String addr = String(foundDevices.getDevice(i).getAddress().toString().c_str());
        Serial.println(addr);
        Serial.println(strdata);
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
        float batt = strtol(majorBatt.c_str(), NULL, 16)/1000;
        unsigned long int x = strtol(xstr.c_str(), NULL, 16);
        unsigned long int y = strtol(ystr.c_str(), NULL, 16);
        unsigned long int z = strtol(zstr.c_str(), NULL, 16);
        Serial.println(tH);
        Serial.println(tL);
        Serial.println(hH);
        Serial.println(hL);
        Serial.println(xL);
        Serial.println(xH);
        Serial.println(yL);
        Serial.println(yH);
        Serial.println(zL);
        Serial.println(zH);
        Serial.println(majorBatt);
        Serial.println(minor);
        Serial.println(rssi);
        Serial.println(temp);
        Serial.println(hum);
        Serial.println(x);
        Serial.println(y);
        Serial.println(z);
        Serial.println(batt);
        float pitch = (atan2(y, sqrt(x * x + z * z))) * 180.0 / pi;
        float roll = (atan2(x, sqrt(y * y + z * z))) * 180.0 / pi;
        Tilt =  sqrt(pitch * pitch + roll * roll);
        Gravity = calculateGravity();
        float SG = 1 + (Gravity / (258.6 - ( (Gravity/258.2) *227.1) ) );
        Serial.println(pitch);
        Serial.println(roll);
        Serial.println(Tilt);
        Serial.println(Gravity);
        if(mqqtOn == 1) {
          String liveData = "addr=" + addr + "&grav=" + SG + "&plat=" + Gravity +"&hum=" + hum + "&tilt=" + Tilt + "&temp=" + temp + "&batt=" + batt;
          postData(liveData);
        }
      }
    }
   pBLEScan->clearResults();
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
  WiFiClientSecure client;
  const int httpPort = 443;
  if (!client.connect(host, httpPort)) 
  {
    Serial.println("connection failed!");
    Serial.println("Trying again!!");
    if (!client.connect(host, httpPort)) 
    { 
      Serial.println("connection failed! Rebooting System!");
      esp_restart();
    }
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
}
