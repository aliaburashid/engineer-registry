const mongoose = require('mongoose')

const engineerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    yearsExperience: Number,
    available: Boolean
})

const Engineer = mongoose.model('Engineer', engineerSchema)

module.exports = Engineer