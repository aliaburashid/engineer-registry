// This file connects your app to MongoDB, and then shares that connection with the rest of your project.

require('dotenv').config() // load hidden env setting in the database like password from a file called .env.
const mongoose = require('mongoose') //  imports Mongoose, which is a tool that makes it easier to talk to MongoDB.

mongoose.connect(process.env.MONGO_URL) // connects your app to your MongoDB database using a secret URL that you stored in the .env file under the name MONGO_URL.

module.exports = mongoose.connection // exports the database connection, so that other parts of your app can use it.