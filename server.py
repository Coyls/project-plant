from simple_websocket_server import WebSocketServer, WebSocket
from protocol import ProtocolDecodeur
from picamera import PiCamera

camera = PiCamera()


class SimpleChat(WebSocket):
    def handle(self):
        dataTr = ProtocolDecodeur(self.data)
        [key, val] = dataTr.getKeyValue()
        if (key == "/button"):
            camera.capture('/home/pi/Desktop/img.jpg')

        print("Key", key)
        print("Value", val)

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
