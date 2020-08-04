const mongoose = require("mongoose")

const Schema = mongoose.Schema

const leagueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  positionSlots: {
    type: Array,
    required: true,
  },
  draftStatus: {
    type: String,
    required: true,
  },
  draftOrder: {
    type: Array,
    required: true,
  },
  scoringType: {
    type: String,
    required: true,
  },
})

const League = mongoose.model("League", leagueSchema)

module.exports = League
