const router = require("express").Router()
const League = require("../models/league.model")

router.route("/").get((req, res) => {
  res.send("hey there admin!")
})

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

// create Owner

// add all Teams (from file in this repo)
// create Team

// create Player
// update Player

// create Ranking
// update Ranking (batch)

module.exports = router
