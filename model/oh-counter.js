const mongoose = require('mongoose')
const Schema = mongoose.Schema

const counterSchema = new Schema({
    count: {
        type: Number
    },
    id: {
        type: String,
        default: 'shemdoe'
    }
}, { timestamps: true, strict: false })

const ohDb = mongoose.connection.useDb('ohmyNew')
const model = ohDb.model('Redirectors', counterSchema)
module.exports = model