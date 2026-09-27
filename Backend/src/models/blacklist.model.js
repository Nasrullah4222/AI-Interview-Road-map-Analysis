const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist!"]
    }
}, {
    timestamps: true
})

const tokenBlaclistModels = mongoose.model("blacklistTokens", blacklistTokenSchema, "blacklisttoken");

module.exports = tokenBlaclistModels;