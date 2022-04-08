import React, { useEffect, useState } from "react"

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState(String)
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toDateString(),
      }

      await socket.emit("send_message", messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("")
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent, index) => {
          return (
            <div id={username === messageContent.author ? "you" : "other"} key={index}>
              <div>Message: "{messageContent.message}"</div>
              <div>From: {messageContent.author}</div>
              <div>Date: {messageContent.time}</div>
            </div>
          )
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value)
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage()
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
