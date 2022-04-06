from websocket import create_connection
import time
from protocol import ProtocolGenerator
from random import randint

ws = create_connection("ws://localhost:8000")

while True:
    prx = randint(0, 200)
    data = ProtocolGenerator("/proximity", str(prx))
    ws.send(data.create())
    time.sleep(2)
