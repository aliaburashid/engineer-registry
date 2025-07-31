const mongoose = require('mongoose')
const bcrypt = require('bcrypt') // loads bcrypt, a library that lets us hash (scramble) passwords before saving them, so they’re secure.
const jwt = require('jsonwebtoken') // loads the JWT (JSON Web Token) library, which we use to create login tokens (kind of like a digital ID card for users when they log in).


// defines the structure of a User in the database:
// Each user will have a name, email, and password, all stored as text.
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // enginners field is an array of IDs, each pointing to a Fruit document in the database (like a “favorite fruits” list).
  // ref:X should be the same as moongoose.model(X, )
  engineers: [{type: mongoose.Schema.Types.ObjectId, ref:'Engineer'}]
})




// Hide password When Sending User Info:
// When you send the user info (like in an API response), this method removes the password so it doesn’t get sent.
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}




// Automatically Hash Passwords:
userSchema.pre('save', async function(next) {
    // Before saving a new user or updated password, this code:
  if (this.isModified('password')) { //  checks if the password field was changed or added. If it was, then continue to hash it.
    this.password = await bcrypt.hash(this.password, 8) //  hashes the password using bcrypt with a salt factor of 8, so it becomes unreadable and more secure.
  }
  next() // After hashing the password (if needed), it tells Mongoose to continue saving the user.
})




// Generate a Token for Login:

// adds a custom function to the user object. This function will create a token for login.
userSchema.methods.generateAuthToken = async function() { 
  const token = jwt.sign({ _id: this._id }, 'secret') // creates a token using the user’s ID. The string 'secret' is the key used to sign the token.
  return token //  Returns the token so the calling code (like a login route) can send it to the user.

}

// This tells Mongoose to create a model called "User" using the schema we defined earlier. Now we can use User.find(), User.create(), etc.
const User = mongoose.model('User', userSchema)

// Exports the User model so it can be used in other files, like when creating or logging in users in your routes.
module.exports = User