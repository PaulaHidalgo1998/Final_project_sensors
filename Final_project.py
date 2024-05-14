import smbus
import time
# for RPI version 1, use bus = smbus.SMBus(0)
bus = smbus.SMBus(1)
# This is the address we setup in the Arduino Program
address = 0x09


def writeNumber(value):
    bus.write_byte(address, value)
    return -1
    
def readNumber():
    motorSpeed = bus.read_byte(address)
    time.sleep(0.001)
    print(motorSpeed)
    speedReference = bus.read_byte(address)
    print(speedReference)
    return motorSpeed, speedReference

while True:
    setpoint = input("Enter a value between 1 and 120:")
    if not setpoint:
        continue
    writeNumber(int(setpoint))
    print("Hi Arduino, I sent you",setpoint)
    time.sleep(1)
    motorSpeed, speedReference = readNumber()
    print ("Arduino: Hey RPI, I received a motor Speed " +  str(motorSpeed) + " and a speed reference " + str(speedReference))
