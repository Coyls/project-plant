from websocket import create_connection
from protocol import ProtocolGenerator

ws = create_connection("ws://localhost:8000")
data = ProtocolGenerator("/button", "1")
ws.send(data.create())
ws.close()
