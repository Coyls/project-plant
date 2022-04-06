from websocket import create_connection
import RPi.GPIO as GPIO
import dht11
import time
from protocol import ProtocolGenerator

ws = create_connection("ws://localhost:8000")


def button_callback(channel):
    print('==============')
    print("button pushed")
    print("Sending data")
    data = ProtocolGenerator("/button", "1")
    ws.send(data.create())
    print('==============')


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO.setup(15, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

GPIO.add_event_detect(15, GPIO.RISING, callback=button_callback)

while True:
    print('Waiting for a push')
    time.sleep(10)