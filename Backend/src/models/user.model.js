const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        unique: [true, "This username already exist."]
    },
    email:{
        type: String,
        unique: [true, "This email already exist."],
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;