const router = require("express").Router()
const League = require("../models/league.model")
const Owner = require("../models/owner.model")
const Team = require("../models/team.model")
const Pick = require("../models/pick.model")
const Player = require("../models/player.model")
const Position_Ranking = require("../models/position_ranking.model")
const Overall_Ranking = require("../models/overall_ranking.model")
const {NFL_Teams} = require("../data/nfl_teams")
const {POSITION_RANKINGS_TOTALS} = require("../data/position_rankings")
const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token)
    return res.status(401).send({auth: false, message: "No token provided."})

  jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      return res
        .status(500)
        .send({auth: false, message: "Failed to authenticate token."})
    }
    req.user = user
    next()
  })
}

router.route("/").get((req, res) => {
  res.send("hey there admin!")
})

router.route("/login").post((req, res) => {
  const {name, password} = req.body
  if (name === process.env.ADMIN_NAME) {
    if (password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(name, process.env.ADMIN_TOKEN_SECRET)
      res.status(200).json({
        user: name,
        accessToken: token,
      })
    } else {
      res.status(401).json({
        status: "error",
        message: "Password does not match!",
      })
    }
  } else {
    res.status(401).json({
      status: "error",
      message: "User does not exist!",
    })
  }
})

// get Leagues
router.route("/league").get(authenticateToken, (req, res) => {
  League.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create League
router.route("/league").post(authenticateToken, (req, res) => {
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
router.route("/league/:leagueId").patch(authenticateToken, (req, res) => {
  League.findByIdAndUpdate(req.params.leagueId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create Owner
router.route("/owner").post(authenticateToken, (req, res) => {
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
router.route("/owner/:ownerId").patch(authenticateToken, (req, res) => {
  Owner.findByIdAndUpdate(req.params.ownerId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// get all owners
router.route("/all_owners").get(authenticateToken, (req, res) => {
  Owner.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// remove owner
router.route("/owner/:ownerId").delete(authenticateToken, (req, res) => {
  Owner.findByIdAndRemove(req.params.ownerId)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// add all Teams (from file in this repo)
router.route("/init_teams").post(authenticateToken, (req, res) => {
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
router.route("/team/:teamId").get(authenticateToken, (req, res) => {
  Team.find({_id: req.params.teamId})
    .then((data) => res.json(data[0]))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create Team
router.route("/team").post(authenticateToken, (req, res) => {
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
router.route("/team/:teamId").patch(authenticateToken, (req, res) => {
  Team.findByIdAndUpdate(req.params.teamId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// get player
router.route("/player/:playerId").get(authenticateToken, (req, res) => {
  Player.find({_id: req.params.playerId})
    .then((data) => res.json(data[0]))
    .catch((err) => res.status(400).json("Error: " + err))
})

// create Player
router.route("/player").post(authenticateToken, (req, res) => {
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
router.route("/player/:playerId").patch(authenticateToken, (req, res) => {
  Player.findByIdAndUpdate(req.params.playerId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// remove player
router.route("/player/:playerId").delete(authenticateToken, (req, res) => {
  Player.findByIdAndRemove(req.params.playerId)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// add all Defenses (after teams are init)
router.route("/init_defenses").post(authenticateToken, (req, res) => {
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
// init all empty overall rankings
router.route("/init_overall_rankings/:scoringType").post((req, res) => {
  for (let i = 1; i < 301; i++) {
    const newOverallRanking = new Overall_Ranking({
      scoringType: req.params.scoringType,
      rank: i,
      playerId: "",
    })

    newOverallRanking
      .save()
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json("Error: " + err))
  }
})

// create Overall Ranking
router.route("/overall_ranking").post((req, res) => {
  const {scoringType, rank, playerId} = req.body

  const newOverallRanking = new Overall_Ranking({
    scoringType,
    rank,
    playerId,
  })

  newOverallRanking
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// update Overall Ranking
router.route("/overall_ranking/:overall_rankingId").patch((req, res) => {
  Overall_Ranking.findByIdAndUpdate(req.params.overall_rankingId, req.body, {
    new: true,
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// remove pick
router.route("/pick/:pickId").delete((req, res) => {
  Pick.findByIdAndRemove(req.params.pickId)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

// remove all picks by league
router.route("/remove_picks/:leagueId").delete((req, res) => {
  Pick.deleteMany({leagueId: req.params.leagueId})
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err))
})

module.exports = router
