const {mockLeagues} = require("./mocks/leagues")
const {mockOwners} = require("./mocks/owners")

const express = require("express")
const bodyParser = require("body-parser")
const http = require("http")
const socketIo = require("socket.io")

const app = express()
const port = process.env.PORT || 4001

const server = http.createServer(app)
const io = socketIo(server)

io.on("connect", (socket) => {
  console.log("new client connected", socket.id)

  socket.on("JoinRoom", (room) => {
    console.log("joining room:", room)
    socket.join(room)

    io.to(room).emit("JoinRoomWelcome", "welcome to " + room)
    io.to(room).emit("StartCheckConnected")
  })

  socket.on("ConfirmConnected", (user) => {
    console.log("confirmed user connected:", user)
    socket.join(user.socketRoom)
    socket
      .to(user.socketRoom)
      .emit("UpdateConnected", `${user.user} has connected`)
  })

  socket.on("test pick", (pick) => {
    console.log("pick came in", pick)
    socket.join(pick.socketRoom)
    socket.to(pick.socketRoom).emit("TestSocket", pick)
  })

  socket.on("disconnect", () => {
    console.log("client disconnected")
    socket.broadcast.emit("")
  })
})

app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000") // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.get("/", (req, res) => res.send("hey there"))

app.get("/api/leagues-list", (req, res) => {
  console.log("mockLeagues", mockLeagues)
  const list = mockLeagues.map((league) => ({
    id: league.id,
    name: league.name,
  }))
  res.send(list)
})

app.post("/api/login", (req, res) => {
  console.log("req.body.name", req.body.name)
  res.send(mockOwners.find((owner) => owner.name === req.body.name))
})

app.post("/api/make_pick", (req, res) => {
  console.log("POST: /api/test", req.body)
  res.send("pick confirmed")
  // TODO: get league_id from owner_id in req.body + use for socket room
  io.to(req.body.socketRoom).emit("PickMade", req.body)
})

server.listen(port, () => console.log("listening at port:", port))
