const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {
        type: Number
    },
    fname: {
        type: String
    },
    points: {
        type: Number
    },
    downloaded: {
        type: Number
    },
    blocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, strict: false})

const dramastore = mongooose.connection.useDb('dramastore')
const model = dramastore.model('botUsersModel', userSchema)
module.exports = model