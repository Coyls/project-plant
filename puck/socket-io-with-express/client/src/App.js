import "./App.css"
import { useState } from "react"
import io from "socket.io-client"
import Chat from "./Chat"

const socket = io.connect("http://localhost:3001")

function App() {
  const [username, setUsername] = useState(String)
  const [room, setRoom] = useState(String)
  const [isChatVisible, setIsChatVisible] = useState(false)

  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room)
      setIsChatVisible(true)
    }
  }

  return (
    <div className="App">
      {!isChatVisible ? (
        <div>
          <h3>Join a chat</h3>
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setUsername(event.target.value)
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && joinRoom()
            }}
          ></input>
          <input
            type="text"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value)
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && joinRoom()
            }}
          ></input>
          <button onClick={joinRoom}>Join a room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  )
}

export default App
