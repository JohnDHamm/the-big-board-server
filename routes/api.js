const {mockLeagues} = require("../mocks/leagues")
const {mockNFLPlayers} = require("../mocks/nfl_players")
const {mockNFLTeams} = require("../mocks/nfl_teams")
const {mockOwners} = require("../mocks/owners")
const {mockNFLPicks} = require("../mocks/picks")
const {mockPositionRankings} = require("../mocks/position_rankings")

const router = require("express").Router()

router.route("/").get((req, res) => {
  res.send("welcome to the api")
})

router.route("/leagues-list").get((req, res) => {
  const list = mockLeagues.map((league) => ({
    id: league.id,
    name: league.name,
  }))
  res.send(list)
})

router.route("/login").post((req, res) => {
  console.log("req.body.name", req.body.name)
  res.send(mockOwners.find((owner) => owner.name === req.body.name))
  // Owner.find()
  //   .then((owners) => res.json(owners))
  //   .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/league/:leagueId").get((req, res) => {
  console.log("req.params", req.params)
  res.send(mockLeagues.find((league) => league.id === req.params.leagueId))
})

router.route("/owners/:leagueId").get((req, res) => {
  console.log("req.params", req.params)
  res.send(mockOwners.filter((owner) => owner.leagueId === req.params.leagueId))
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
  res.send(mockNFLTeams)
})

router.route("/players").get((req, res) => {
  res.send(mockNFLPlayers)
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
