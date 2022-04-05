from websocket import create_connection
import RPi.GPIO as GPIO
import dht11
from protocol import ProtocolGenerator
import time

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()
instance = dht11.DHT11(pin=14)

ws = create_connection("ws://localhost:8000")
while True:
    result = instance.read()

    dataTemp = ProtocolGenerator("/temp", f"{result.temperature}")
    dataHum = ProtocolGenerator("/temp", f"{result.humidity}")

    ws.send(dataTemp.create())
    ws.send(dataHum.create())
    print("Sent")
    time.sleep(10)
ws.close()
