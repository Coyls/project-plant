const express = require("express")
const bodyParser = require("body-parser")
const app = express()

const server = require("http").Server(app)
const io = require("socket.io")(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get("/", (req, res) => {
   res.sendFile('index.html', { root: __dirname })
})

app.get("/json", (req, res) => {
   res.status(200).json({"message":"ok"})
})

io.on("connection", (socket) => {
  console.log(`Connecté au client ${socket.id}`)
  
  let count = 0
  setInterval(() => {
    count ++
    io.emit("message", `Message ${count}`)
  }, 1000)
})

server.listen(4000, () => {
 console.log("Server running")
})
