#include "DHT.h"
#include <WiFi.h>
#include <ThingsBoard.h>

// Wifi ssid and password
#define WIFI_AP "Your SSID"
#define WIFI_PASSWORD "Your Password"

// Thingsboard config
#define TOKEN "Your token from thingsboard"
#define THINGSBOARD_SERVER "XX.XX.XXX.XXX" // ip address 
#define THINGSBOARD_PORT XXXXX // forwarded port in nodeport settings from deployment.yaml file.

// DHT temperature and humidity sensor
#define DHTPIN 21
#define DHTTYPE DHT22

// Initialize the Ethernet client object
WiFiClient espClient;

// Initialize DHT sensor.
DHT dht(DHTPIN, DHTTYPE);

ThingsBoardHttp tb(espClient, TOKEN, THINGSBOARD_SERVER, THINGSBOARD_PORT);

int status = WL_IDLE_STATUS;
unsigned long lastSend;

void setup() {
  // initialize serial for debugging
  Serial.begin(9600);
  dht.begin();
  InitWiFi();
  lastSend = 0;
}

void loop() {
  status = WiFi.status();
  if ( status != WL_CONNECTED) {
    while ( status != WL_CONNECTED) {
      Serial.print("Attempting to connect to WPA SSID: ");
      Serial.println(WIFI_AP);
      // Connect to WPA/WPA2 network
      status = WiFi.begin(WIFI_AP, WIFI_PASSWORD);
      delay(500);
    }
    Serial.println("Connected to AP");
  }

  if ( millis() - lastSend > 30000 ) { // Update and send only after 30 seconds
    getAndSendTemperatureAndHumidityData();
    lastSend = millis();
  }

}

void getAndSendTemperatureAndHumidityData()
{
  Serial.println("Collecting temperature data.");

  // Reading temperature or humidity takes about 250 milliseconds!
  float humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float temperature = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.println("Sending data to ThingsBoard:");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C ");

  tb.sendTelemetryFloat("temperature", temperature);
  tb.sendTelemetryFloat("humidity", humidity);
}

void InitWiFi()
{
  Serial.println("Connecting to AP ...");
  WiFi.begin(WIFI_AP, WIFI_PASSWORD);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  
  // attempt to connect to WiFi network
  
  Serial.println("Connected to network");
  
}
