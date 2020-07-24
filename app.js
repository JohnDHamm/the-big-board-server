const {mockLeagues} = require("./mocks/leagues")
const {mockNFLPlayers} = require("./mocks/nfl_players")
const {mockNFLTeams} = require("./mocks/nfl_teams")
const {mockOwners} = require("./mocks/owners")
const {mockNFLPicks} = require("./mocks/picks")
const {mockPositionRankings} = require("./mocks/position_rankings")

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

app.get("/api/league/:leagueId", (req, res) => {
  console.log("req.params", req.params)
  res.send(mockLeagues.find((league) => league.id === req.params.leagueId))
})

app.get("/api/owners/:leagueId", (req, res) => {
  console.log("req.params", req.params)
  res.send(mockOwners.filter((owner) => owner.leagueId === req.params.leagueId))
})

app.get("/api/position_rankings/:scoringType", (req, res) => {
  console.log("req.params", req.params)
  res.send(
    mockPositionRankings.filter(
      (ranking) => ranking.scoringType === req.params.scoringType
    )
  )
})

app.get("/api/teams", (req, res) => {
  res.send(mockNFLTeams)
})

app.get("/api/players", (req, res) => {
  res.send(mockNFLPlayers)
})

app.get("/api/picks/:leagueId", (req, res) => {
  const leaguePicks = mockNFLPicks.filter(
    (pick) => pick.leagueId === req.params.leagueId
  )
  const formattedPicks = leaguePicks.map((pick) => ({
    selectionNumber: pick.selectionNumber,
    ownerId: pick.ownerId,
    playerId: pick.playerId,
  }))
  res.send(formattedPicks)
})

app.post("/api/make_pick", (req, res) => {
  console.log("POST: /api/test", req.body)
  res.send("pick confirmed")
  // TODO: get league_id from owner_id in req.body + use for socket room
  io.to(req.body.socketRoom).emit("PickMade", req.body)
})

server.listen(port, () => console.log("listening at port:", port))
