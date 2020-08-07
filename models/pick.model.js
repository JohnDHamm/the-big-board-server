const mongoose = require("mongoose")

const Schema = mongoose.Schema

const pickSchema = new Schema({
  selectionNumber: {
    type: Number,
    required: true,
  },
  leagueId: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  playerId: {
    type: String,
    required: true,
  },
})

const Pick = mongoose.model("Pick", pickSchema)

module.exports = Pick
