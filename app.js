const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const app = express()
const port = process.env.PORT || 4001

const server = http.createServer(app)
const io = socketIo(server)

let count = 0

io.on("connection", (socket) => {
  console.log("new client connected")
  count = count + 1
  socket.broadcast.emit("FromAPI", count)
  socket.emit("StartCheckConnected")

  socket.on("ConfirmConnected", (user) => {
    console.log("confirmed user connected:", user)
    socket.broadcast.emit("UpdateConnected", `${user.user} has connected`)
  })

  socket.on("test pick", (pick) => {
    console.log("pick came in", pick)
    socket.broadcast.emit("TestSocket", pick)
  })

  socket.on("disconnect", () => {
    console.log("client disconnected")
    count = count - 1
    socket.broadcast.emit("FromAPI", count)
  })
})

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000") // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.get("/", (req, res) => res.send("hey there"))

app.post("/api/test", (req, res) => {
  console.log("POST api/test")
  res.send("hey")
})

server.listen(port, () => console.log("listening at port:", port))
