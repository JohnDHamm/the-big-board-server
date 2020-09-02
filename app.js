const express = require("express")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
const mongoose = require("mongoose")
const League = require("./models/league.model")
const Owner = require("./models/owner.model")
const Pick = require("./models/pick.model")

require("dotenv").config()

const app = express()
const port = process.env.PORT || 4001

app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = socketIo(server)

io.on("connect", (socket) => {
  console.log("new client connected", socket.id)

  socket.on("JoinRoom", (room) => {
    console.log("joining room:", room)
    socket.join(room)

    // io.to(room).emit("JoinRoomWelcome", "welcome to " + room)
    // io.to(room).emit("StartCheckConnected")
  })

  // socket.on("ConfirmConnected", (user) => {
  //   console.log("confirmed user connected:", user)
  //   socket.join(user.socketRoom)
  //   socket
  //     .to(user.socketRoom)
  //     .emit("UpdateConnected", `${user.user} has connected`)
  // })

  // socket.on("disconnect", () => {
  //   console.log("client disconnected")
  //   socket.broadcast.emit("")
  // })
})

const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
const connection = mongoose.connection
connection.once("open", () => {
  console.log("MongoDB connected")
})

const adminRouter = require("./routes/admin")
const apiRouter = require("./routes/api")

app.use("/admin", adminRouter)
app.use("/api", apiRouter)

app.get("/", (req, res) => res.send("hey there"))

// API with response sockets
app.post("/api/login", (req, res) => {
  Owner.find({
    name: req.body.name,
    leagueId: req.body.leagueId,
  })
    .then((owners) => {
      if (owners[0]) {
        const user = owners[0]
        if (req.body.password === user.password) {
          const newUser = {
            _id: user._id,
            name: user.name,
            leagueId: user.leagueId,
            isCommish: user.isCommish,
          }
          res.json(newUser)
          io.to(req.body.leagueId).emit(
            "JoinRoomWelcome",
            req.body.name + " has joined."
          )
        } else {
          res.status(404).json({
            status: "error",
            message: "Incorrect Password!",
          })
        }
      } else {
        res.status(404).json({
          status: "error",
          message: "User does not exist!",
        })
      }
    })
    .catch((err) => res.status(400).json("Error: " + err))
})

app.post("/api/pick", (req, res) => {
  const {selectionNumber, leagueId, ownerId, playerId} = req.body

  const newPick = new Pick({
    selectionNumber,
    leagueId,
    ownerId,
    playerId,
  })

  newPick
    .save()
    .then((data) => {
      res.json(data)
      io.to(leagueId).emit("PickMade", data)
    })
    .catch((err) => res.status(400).json("Error: " + err))
})

app.patch("/api/draft_status/:leagueId", (req, res) => {
  const {leagueId} = req.params
  League.findByIdAndUpdate(leagueId, req.body, {
    new: true,
  })
    .then((data) => {
      res.json(data)
      io.to(leagueId).emit("DraftStatusUpdate", req.body.draftStatus)
    })
    .catch((err) => res.status(400).json("Error: " + err))
})

app.patch("/commish/start_draft", (req, res) => {
  const {leagueId, message} = req.body
  League.findByIdAndUpdate(
    leagueId,
    {draftStatus: "open"},
    {
      new: true,
    }
  )
    .then((data) => {
      res.json(data)
      io.to(leagueId).emit("DraftStarted", message)
    })
    .catch((err) => res.status(400).json("Error: " + err))
})

app.patch("/commish/pause_draft", (req, res) => {
  const {leagueId, message} = req.body
  League.findByIdAndUpdate(
    leagueId,
    {draftStatus: "paused"},
    {
      new: true,
    }
  )
    .then((data) => {
      res.json(data)
      io.to(leagueId).emit("DraftPaused", message)
    })
    .catch((err) => res.status(400).json("Error: " + err))
})

app.patch("/commish/reopen_draft", (req, res) => {
  const {leagueId, message} = req.body
  League.findByIdAndUpdate(
    leagueId,
    {draftStatus: "open"},
    {
      new: true,
    }
  )
    .then((data) => {
      res.json(data)
      io.to(leagueId).emit("DraftReopened", message)
    })
    .catch((err) => res.status(400).json("Error: " + err))
})

server.listen(port, () => console.log("listening at port:", port))
