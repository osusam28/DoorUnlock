/*
 MQTT subscriber example

  - connects to an MQTT server
  - subscribes to the topic "inTopic"
*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char *ssid =	"NETGEAR89";		// cannot be longer than 32 characters!
const char *pass =	"redumbrella108";		//

// Update these with values suitable for your network.

#define BUFFER_SIZE 100

void callback(const MQTT::Publish& pub) {
  Serial.print(pub.topic());
  Serial.print(" => ");
  if (pub.has_stream()) {
    uint8_t buf[BUFFER_SIZE];
    int read;
    while (read = pub.payload_stream()->read(buf, BUFFER_SIZE)) {
      Serial.write(buf, read);
    }
    pub.payload_stream()->stop();
    Serial.println("");
  } else {
    Serial.println(pub.payload_string());
  }

  if(pub.payload_string().indexOf("1") != -1) {
    digitalWrite(12, HIGH);
    delay(1000);
    digitalWrite(12, LOW);
  }
}

WiFiClient wclient;
PubSubClient client(wclient, "iot.eclipse.org", 1883);

void setup() {
  // Setup console
  pinMode(12, OUTPUT);
  digitalWrite(12, LOW);
  Serial.begin(115200);
  delay(10);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Connecting to ");
    Serial.print(ssid);
    Serial.println("...");
    WiFi.begin(ssid, pass);

    if (WiFi.waitForConnectResult() != WL_CONNECTED)
      return;
    Serial.println("WiFi connected");
  }

  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      if (client.connect("arduinoClient")) {
      	client.set_callback(callback);
      	client.subscribe("test");
      }
    }

    if (client.connected())
      client.loop();
  }
}
