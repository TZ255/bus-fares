const mongoose = require('mongoose')
const Schema = mongoose.Schema

const regSchema = new Schema({
    mkoa: {type: String},
    info: {type: Array},
}, {strict: false, timestamps: true})

const model = mongoose.model('Regions', regSchema)
module.exports = model
