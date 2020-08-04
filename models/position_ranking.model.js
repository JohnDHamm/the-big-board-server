const mongoose = require("mongoose")

const Schema = mongoose.Schema

const posRankingSchema = new Schema({
  position: {
    type: String,
    required: true,
  },
  scoringType: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  playerId: {
    type: String,
  },
})

const Position_Ranking = mongoose.model("Position_Ranking", posRankingSchema)

module.exports = Position_Ranking
