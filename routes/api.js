const {mockLeagues} = require("../mocks/leagues")
const {mockOwners} = require("../mocks/owners")
const {mockNFLPicks} = require("../mocks/picks")
const {mockPositionRankings} = require("../mocks/position_rankings")
const Team = require("../models/team.model")
const Player = require("../models/player.model")
const Owner = require("../models/owner.model")
const League = require("../models/league.model")

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
  console.log("req.params", req.params)
  res.send(
    mockPositionRankings.filter(
      (ranking) => ranking.scoringType === req.params.scoringType
    )
  )
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

router.route("/make_pick").post((req, res) => {
  console.log("POST: /api/test", req.body)
  res.send("pick confirmed")
  // TODO: get league_id from owner_id in req.body + use for socket room
  // io.to(req.body.socketRoom).emit("PickMade", req.body)
})

module.exports = router
