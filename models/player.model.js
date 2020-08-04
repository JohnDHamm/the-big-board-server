const mongoose = require("mongoose")

const Schema = mongoose.Schema

const playerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  teamId: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
})

const Player = mongoose.model("Player", playerSchema)

module.exports = Player
