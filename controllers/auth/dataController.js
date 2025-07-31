const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// instead of creating an object we can use the exports object directly
// this is how

// To protect private routes. It checks if the request has a valid token and identifies the logged-in user.
exports.auth = async (req, res, next) => {
  try {
    let token
    if(req.query.token){
      token = req.query.token
    }else {
      token = req.header('Authorization').replace('Bearer ', '')
    }
    const data = jwt.verify(token, 'secret')
    const user = await User.findOne({ _id: data._id })
    if (!user) {
      throw new Error()
    }
    req.user = user
    res.locals.data.token = token
    next()
  } catch (error) {
    res.status(401).send('Not authorized')
  }
}

exports.createUser = async (req, res, next) => {
    try {
        //  creates a new user using the data sent in the request (like name, email, password).
        const user = new User(req.body)
        await user.save() // saves the new user to the MongoDB database. // Before saving, your pre('save') hook will automatically hash the password.
        const token = await user.generateAuthToken() // Calls your custom generateAuthToken() method (from the user model) to create a login token (JWT) for the new user.
        res.locals.data.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        // Searches the database for a user whose email matches the one sent in the request body.
        const user = await User.findOne({ email: req.body.email })
        // Checks two things:
        // If user doesn't exist (email not found)
        // If the password doesn’t match the hashed password in the DB (using bcrypt to compare)
        // If either one fails, then login should not go through.
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            res.status(400).send('Invalid login credentials')
        } else { // if succesfull
            const token = await user.generateAuthToken() // Generate a JWT token for the logged-in user. This will allow them to stay logged in and access protected routes.
            res.locals.data.token = token
            req.user = user
            next()
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        // gets the list of fields the user wants to update.
        const updates = Object.keys(req.body)
        // Find the user in the database by their ID, which comes from the route parameter /users/:id.
        const user = await User.findOne({ _id: req.params.id })
        // For each field (like "name" or "email"), update the user object with the new value from the request
        // example: user.name = req.body.name // user.email = req.body.email
        updates.forEach(update => user[update] = req.body[update])
        // Save the updated user back into the database. 
        // If the password was changed, your pre('save') hook will re-hash it.
        await user.save()
        res.json(user) // Send the updated user data back to the client as a JSON response.
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

exports.deleteUser = async (req, res) => {
    try {
        // req.user means the current logged-in user (you probably set this earlier using a middleware).
        // deleteOne() is a Mongoose method that deletes that user document from the database.
        // await waits for the delete to finish before moving on.
        await req.user.deleteOne()
        res.json({ message: 'User deleted' }) // If the delete was successful, this sends a JSON response to the client saying "User deleted".
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}