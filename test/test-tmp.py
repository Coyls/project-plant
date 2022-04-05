from websocket import create_connection
import time
from protocol import ProtocolGenerator
from random import randint


ws = create_connection("ws://localhost:8000")

while True:
    tmp = randint(0, 100)
    data = ProtocolGenerator("/temp", str(tmp))
    ws.send(data.create())
    time.sleep(4)
