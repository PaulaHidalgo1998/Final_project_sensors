#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt #import the client1
import time
import random

import smbus
import time

# for RPI version 1, use bus = smbus.SMBus(0)
bus = smbus.SMBus(1)
# This is the address we setup in the Arduino Program
address = 0x09

#Setting the broker IP address
host= "10.5.3.101"
# Setting the broker port
port=15675

client_pubRef = mqtt.Client()
client_pubSpeed = mqtt.Client()
client_subSetpoint = mqtt.Client()

client_pubRef.connect(host, port)
client_pubSpeed.connect(host, port)
client_subSetpoint.connect(host, port)

client_subSetpoint.subscribe("data/setpoint")
client_subSetpoint.loop_start()


def sub_set_point_clbk (client, userdata, message):
    writeNumber(int(setpoint))
    print("Hi Arduino, I sent you ",setpoint)

def writeNumber(value):
    bus.write_byte(address, value)
    return -1
    
def readNumber():
    motorSpeed = bus.read_byte(address)
    time.sleep(0.1)
    print(motorSpeed)
    speedReference = bus.read_byte(address)
    time.sleep(0.1)
    print(speedReference)
    return motorSpeed, speedReference

def main():
    print("Enter a value between 1 and 120:")
    while True:
        motorSpeed, speedReference = readNumber()

        client_pubRef.publish("data/reference", speedReference)
        client_pubSpeed.publish("data/speed", motorSpeed)
        client_subSetpoint.on_message=sub_set_point_clbk

        print ("Arduino: Hey RPI, I received a motor Speed " +  str(motorSpeed) + " and a speed reference " + str(speedReference))

        
    client_subSetpoint.loop_stop()

main()