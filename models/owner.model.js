const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ownerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  leagueId: {
    type: String,
    required: true,
  },
  isCommish: {
    type: Boolean,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const Owner = mongoose.model("Owner", ownerSchema)

module.exports = Owner
