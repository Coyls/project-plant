const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")

const PORT = 4001
const URL = `http://localhost:${PORT}`

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

  socket.on("button_pressed", (data) => {
    console.log(`Button ${data} pressed`)
    io.emit("start_detection", `${data}`)
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// ------------------------------------------------------

server.listen(PORT, () => {
  console.log(`Server running: ${URL}`)
})
