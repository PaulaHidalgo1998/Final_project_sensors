#include <Wire.h>
#define SLAVE_ADDRESS 0x09

bool flagSend = false;
double motorSpeed;
double speedReference;
double valueSend;
double part1ValueSend;
double setpoint;

void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);  // start serial for output
  // initialize i2c as slave
  Wire.begin(SLAVE_ADDRESS);
  // define callbacks for i2c communication
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);
  Serial.println("Ready !");
}
void loop() {
  delay(100);
}
// callback for received data
void receiveData(int byteCount) {
  while (Wire.available()) {
    setpoint = Wire.read();
    Serial.print("data received: ");
    Serial.println(setpoint);
  }
}

// callback for sending data
void sendData() {
  if (flagSend == false) {
    valueSend = motorSpeed;
    flagSend = true;
  } else {
    valueSend = speedReference;
    flagSend = false;
  }
  
  Wire.write(valueSend);

  delay(1000);
}