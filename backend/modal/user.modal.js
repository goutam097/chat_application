const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8,
    },
    phone: {
        type: Number,
        require: true,
    },
    image: {
        type: String,
    }
},
    {
        timestamps: true,
    });

module.exports = mongoose.model("Users", userSchema)