const Team = require("../models/team.model")
const Player = require("../models/player.model")
const Owner = require("../models/owner.model")
const League = require("../models/league.model")
const Position_Ranking = require("../models/position_ranking.model")
const Overall_Ranking = require("../models/overall_ranking.model")
const Pick = require("../models/pick.model")
const authenticateToken = require("../utils/index.js")

const router = require("express").Router()

router.route("/").get((req, res) => {
  res.send("welcome to the api")
})

router.route("/leagues-list").get((req, res) => {
  League.find({}, "_id name")
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/league/:leagueId").get(authenticateToken, (req, res) => {
  League.findById(req.params.leagueId)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/owners/:leagueId").get(authenticateToken, (req, res) => {
  Owner.find({leagueId: req.params.leagueId}, "name leagueId isCommish")
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router
  .route("/position_rankings/:scoringType")
  .get(authenticateToken, (req, res) => {
    Position_Ranking.find({scoringType: req.params.scoringType})
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json("Error: " + err))
  })

router
  .route("/overall_rankings/:scoringType")
  .get(authenticateToken, (req, res) => {
    Overall_Ranking.find({scoringType: req.params.scoringType})
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json("Error: " + err))
  })

router.route("/teams").get(authenticateToken, (req, res) => {
  Team.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/players").get(authenticateToken, (req, res) => {
  Player.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/picks/:leagueId").get(authenticateToken, (req, res) => {
  Pick.find({leagueId: req.params.leagueId}, "selectionNumber ownerId playerId")
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

module.exports = router
