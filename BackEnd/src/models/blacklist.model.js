const mongoose  = require("mongoose")   /*for token blacklisting we use mongoDb for that now we are using Mongoose*/


const blacklistTokenSchema = new mongoose.Schema({
  token:{
    type: String,
    required: [true, "token is required to be added in the blackList"]
  }
},{
  timestamps: true
})

const tokenBlackListModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlackListModel