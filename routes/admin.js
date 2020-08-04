const router = require("express").Router()
const League = require("../models/league.model")
const Owner = require("../models/owner.model")
const Team = require("../models/team.model")
const Player = require("../models/player.model")
const Position_Ranking = require("../models/position_ranking.model")

router.route("/").get((req, res) => {
  res.send("hey there admin!")
})

// create League
router.route("/league").post((req, res) => {
  const {name, positionSlots, draftStatus, draftOrder, scoringType} = req.body

  const newLeague = new League({
    name,
    positionSlots,
    draftStatus,
    draftOrder,
    scoringType,
  })

  newLeague
    .save()
    .then(() => res.json("league added"))
    .catch((err) => res.status(400).json("Error: " + err))
})

// update League
router.route("/league/:leagueId").patch((req, res) => {
  League.findByIdAndUpdate(req.params.leagueId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create Owner
router.route("/owner").post((req, res) => {
  const {name, leagueId, isCommish, password} = req.body

  const newOwner = new Owner({
    name,
    leagueId,
    isCommish,
    password,
  })

  newOwner
    .save()
    .then(() => res.json("owner added"))
    .catch((err) => res.status(400).json("Error: " + err))
})

// update Owner
router.route("/owner/:ownerId").patch((req, res) => {
  Owner.findByIdAndUpdate(req.params.ownerId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// add all Teams (from file in this repo)

// create Team
router.route("/team").post((req, res) => {
  const {city, nickname, abbv, colors, byeWeek} = req.body

  const newTeam = new Team({
    city,
    nickname,
    abbv,
    colors,
    byeWeek,
  })

  newTeam
    .save()
    .then(() => res.json("team added"))
    .catch((err) => res.status(400).json("Error: " + err))
})

// update Team
router.route("/team/:teamId").patch((req, res) => {
  Team.findByIdAndUpdate(req.params.teamId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create Player
router.route("/player").post((req, res) => {
  const {firstName, lastName, teamId, position} = req.body

  const newPlayer = new Player({
    firstName,
    lastName,
    teamId,
    position,
  })

  newPlayer
    .save()
    .then(() => res.json("player added"))
    .catch((err) => res.status(400).json("Error: " + err))
})

// update Player
router.route("/player/:playerId").patch((req, res) => {
  Player.findByIdAndUpdate(req.params.playerId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create Position Ranking
router.route("/position_ranking").post((req, res) => {
  const {position, scoringType, rank, playerId} = req.body

  const newPositionRanking = new Position_Ranking({
    position,
    scoringType,
    rank,
    playerId,
  })

  newPositionRanking
    .save()
    .then(() => res.json("ranking added"))
    .catch((err) => res.status(400).json("Error: " + err))
})

// update Position Ranking
router.route("/position_ranking/:position_rankingId").patch((req, res) => {
  Position_Ranking.findByIdAndUpdate(req.params.position_rankingId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

module.exports = router
