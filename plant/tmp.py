from websocket import create_connection
import RPi.GPIO as GPIO
import dht11
from protocol import ProtocolGenerator
import time
import math

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()
instance = dht11.DHT11(pin=14)


ws = create_connection("ws://localhost:8000")

while True:
    result = instance.read()

    # print(float(f"{result.temperature}"))

    print(str(math.ceil(float(f"{result.temperature}"))))
    data = ProtocolGenerator("/temp",str(math.ceil(float(f"{result.temperature}"))))
    ws.send(data.create())
    time.sleep(4)
