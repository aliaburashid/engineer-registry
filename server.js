require('dotenv').config() // loads environment 
const app = require('./app') // starts the express server 
const db = require('./models/db') // connects to mongo
const PORT = process.env.PORT || 3000

// wait for the database to say im ready and then prints a success message 
db.once('open', () => {
    console.log('connected to mongo')
})

// If something goes wrong with the database, it prints the error message so you know.
db.on('error', (error) => {
  console.error(error.message)
})

// starts the server 
app.listen(PORT, () => {
    console.log(`We in the building ${PORT}`)
})

