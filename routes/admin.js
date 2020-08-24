const router = require("express").Router()
const League = require("../models/league.model")
const Owner = require("../models/owner.model")
const Team = require("../models/team.model")
const Player = require("../models/player.model")
const Position_Ranking = require("../models/position_ranking.model")
const {NFL_Teams} = require("../data/nfl_teams")
const {POSITION_RANKINGS_TOTALS} = require("../data/position_rankings")
const {route} = require("./api")

router.route("/").get((req, res) => {
  res.send("hey there admin!")
})

// get Leagues
router.route("/league").get((req, res) => {
  League.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
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
    .then((data) => res.json(data))
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
    .then((data) => res.json(data))
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
router.route("/init_teams").post((req, res) => {
  // console.log("initializing teams", NFL_Teams)
  NFL_Teams.forEach((team) => {
    const {city, nickname, abbv, colors, byeWeek} = team
    console.log("city", city)

    const newTeam = new Team({
      city,
      nickname,
      abbv,
      colors,
      byeWeek,
    })

    newTeam
      .save()
      .then(() => res.json("teams initialized"))
      .catch((err) => res.status(400).json("Error: " + err))
  })
})

// get team
router.route("/team/:teamId").get((req, res) => {
  Team.find({_id: req.params.teamId})
    .then((data) => res.json(data[0]))
    .catch((err) => res.status(400).json("Error: " + err))
})

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

// get player
router.route("/player/:playerId").get((req, res) => {
  Player.find({_id: req.params.playerId})
    .then((data) => res.json(data[0]))
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
    .then((data) => res.json(data))
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

// remove player
router.route("/player/:playerId").delete((req, res) => {
  Player.findByIdAndRemove(req.params.playerId)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// add all Defenses (after teams are init)
router.route("/init_defenses").post((req, res) => {
  Team.find()
    .then((teams) => {
      teams.forEach((team) => {
        const {_id, city, nickname, abbv} = team
        if (abbv !== "UNK") {
          const newDefense = new Player({
            firstName: city,
            lastName: nickname,
            teamId: _id,
            position: "D",
          })

          newDefense
            .save()
            .then((data) => res.json(data))
            .catch((err) => res.status(400).json("Error: " + err))
        }
      })
    })
    .then(() => res.json("defenses initalized"))
    .catch((err) => res.status(400).json("Error: " + err))
})

// init all empty position rankings
router.route("/init_pos_rankings/:scoringType").post((req, res) => {
  const positions = Object.keys(POSITION_RANKINGS_TOTALS)
  // console.log("positions", positions)
  positions.forEach((pos) => {
    for (let i = 1; i < POSITION_RANKINGS_TOTALS[pos] + 1; i++) {
      const newPosRanking = new Position_Ranking({
        position: pos,
        scoringType: req.params.scoringType,
        rank: i,
        playerId: "",
      })

      newPosRanking
        .save()
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json("Error: " + err))
    }
  })
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
    .then((data) => res.json(data))
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
