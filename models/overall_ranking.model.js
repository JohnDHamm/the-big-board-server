const mongoose = require("mongoose")

const Schema = mongoose.Schema

const overallRankingSchema = new Schema({
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

const Overall_Ranking = mongoose.model("Overall_Ranking", overallRankingSchema)

module.exports = Overall_Ranking
