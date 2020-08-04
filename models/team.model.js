const mongoose = require("mongoose")

const Schema = mongoose.Schema

const teamSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  abbv: {
    type: String,
    required: true,
  },
  colors: {
    primary: {
      type: String,
      required: true,
    },
    secondary: {
      type: String,
      required: true,
    },
  },
  byeWeek: {
    type: Number,
    required: true,
  },
})

const Team = mongoose.model("Team", teamSchema)

module.exports = Team
