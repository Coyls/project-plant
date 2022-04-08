require("dotenv").config()

// ------------------------------------------------------ ENV VARIABLES

const PORT = 4000
const URL = `http://localhost:${PORT}`

// ------------------------------------------------------

const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
  },
})

// ------------------------------------------------------

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname })
})

// ------------------------------------------------------

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    console.log(`${data.user} (${socket.id}) joined "${data.room}"`)
    socket.join(data.room)
  })

  socket.on("send_message", (data) => {
    // console.log(`"${data.message}" from ${data.user}`)
    console.log(data)
    socket.to("telegraph-room").emit("receive_message", data)
  })

  socket.on("button_pressed", (data) => {
    console.log("Button pressed", data)
    io.emit("button_event", `${data.userId}:${data.type}`)
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// ------------------------------------------------------

server.listen(PORT, () => {
  console.log(`Server running: ${URL}`)
})
