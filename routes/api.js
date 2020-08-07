const Team = require("../models/team.model")
const Player = require("../models/player.model")
const Owner = require("../models/owner.model")
const League = require("../models/league.model")
const Position_Ranking = require("../models/position_ranking.model")
const Pick = require("../models/pick.model")

const router = require("express").Router()

router.route("/").get((req, res) => {
  res.send("welcome to the api")
})

router.route("/leagues-list").get((req, res) => {
  League.find({}, "_id name")
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/login").post((req, res) => {
  Owner.find({name: req.body.name})
    .then((owner) => res.json(owner[0]))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/league/:leagueId").get((req, res) => {
  League.findById(req.params.leagueId)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/owners/:leagueId").get((req, res) => {
  Owner.find({leagueId: req.params.leagueId})
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/position_rankings/:scoringType").get((req, res) => {
  Position_Ranking.find({scoringType: req.params.scoringType})
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/teams").get((req, res) => {
  Team.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/players").get((req, res) => {
  Player.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/picks/:leagueId").get((req, res) => {
  Pick.find({}, "selectionNumber ownerId playerId")
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/pick").post((req, res) => {
  const {selectionNumber, leagueId, ownerId, playerId} = req.body

  const newPick = new Pick({
    selectionNumber,
    leagueId,
    ownerId,
    playerId,
  })

  newPick
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))

  // TODO: use leagueId for socket room
  // io.to(req.body.socketRoom).emit("PickMade", req.body)
})

module.exports = router
