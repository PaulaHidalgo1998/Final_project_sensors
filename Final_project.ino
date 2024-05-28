#include <Wire.h>
#define SLAVE_ADDRESS 0x09

bool flagSend = false;
int valueSend;
int speedReference;
long m1,m2; //Store time in interrupts
float speed;//Sepeed calculation
long t_tot=0;//Mean value of interrupts
long up_times[3]={0,0,0};//Interrupts timing
int index=0; //Intex for interrupts timing
int pin = 2; // Encoder pin
int PWM = 3; //PWM pin
int SetPoint;
float kp = 0.55;
float ki = 0.5;
float kd = 0.001;
float integralError = 0;
float previousError;
float derivativeOutput;
float integralOutput;
float error ,control;
long t_min;
//Interrupt for encoder
void int0()
{
m1=micros();
up_times[index]=m1-m2;
index=(index+1)%3;
m2=m1;
}
void setup() {
//Configuration i2c
pinMode(13,OUTPUT);
Wire.begin(SLAVE_ADDRESS);
// define callbacks for i2c communication
Wire.onReceive(receiveData);
Wire.onRequest(sendData);
Serial.println("Ready !");
  
pinMode(pin, INPUT);
pinMode(12,INPUT);
digitalWrite(12,HIGH);
digitalWrite(pin,HIGH);


attachInterrupt(digitalPinToInterrupt(pin), int0, RISING);
//Initialize serial and wait for port to open:
Serial.begin(115200);
while (!Serial) {
; // wait for serial port to connect. Needed for native USB
}
}
void loop() {
Serial.println("---------------------------------------");

  delay(250); //whait for 2 seconds
  //to allow the ,motor to stabilize
  
  t_min=up_times[0]+up_times[1]+up_times[2];
  speed=60E6/t_min/30; //Compute speed

  
  if (speed > 255){
    speed= 0;
  }

  error = SetPoint - speed;
  speedReference = SetPoint;
  
  //Integral part
  integralError += error;
  integralOutput = ki * integralError;

  //derivative part
  derivativeOutput = kd * (error - previousError);
  previousError = error;
  control = kp * error + integralOutput + derivativeOutput; 


  if (control > 255){
    control= 254;
  }
  
  
    
  analogWrite(PWM,control); //set pwm

  //Serial.print(i);
  Serial.print(",");
  Serial.println(speed); //print speed
  Serial.println(error);
  Serial.println(control);
  
}

//Callback receive
void receiveData(int byteCount){
  while (Wire.available()) {
    SetPoint = Wire.read();
    Serial.print("data received: ");
    Serial.println(SetPoint);
  }

}

//Callback Send
// callback for sending data
void sendData() {
  Serial.println("Inside send***************************");
  if (flagSend == false) {
    valueSend = speed;
    flagSend = true;
  } else {
    valueSend = speedReference;
    flagSend = false;
  }

  Wire.write(valueSend);

  delay(1000);
}
