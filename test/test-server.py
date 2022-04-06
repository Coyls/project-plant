from simple_websocket_server import WebSocketServer, WebSocket
from protocol import ProtocolDecodeur
import time


class Acc:
    button = 0
    proximity = 0
    temp = 0

    def setValue(self, key: str, val: str):
        if key == "/temp":
            self.temp = int(val)
        if key == "/proximity":
            self.proximity = int(val)
        if key == "/button":
            self.button = int(val)


class SimpleChat(WebSocket):

    acc = Acc()

    def handle(self):
        dataTr = ProtocolDecodeur(self.data)
        [key, val] = dataTr.getKeyValue()

        self.acc.setValue(key, val)

        if (self.acc.temp > 30 and self.acc.proximity < 120):
            print("tmp :", self.acc.temp)
            print("prx :", self.acc.proximity)
            print("OK")

        if(self.acc.button == 1):
            print("PRESS")
            self.acc.button = 0

    def connected(self):
        print(self.address, 'connected')
        for client in clients:
            client.send_message(self.address[0] + u' - connected')
        clients.append(self)

    def handle_close(self):
        clients.remove(self)
        print(self.address, 'closed')
        for client in clients:
            client.send_message(self.address[0] + u' - disconnected')


clients = []

server = WebSocketServer('', 8000, SimpleChat)
server.serve_forever()
