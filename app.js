// This file builds your Express server setup, 
// connects middleware, views, static files, and routes 
// then exports it so server.js can start it.

// load libraries 
const express = require('express')
const morgan = require('morgan') // Loads Morgan, a tool that logs incoming requests (great for debugging).
const jsxEngine = require('jsx-view-engine') // Allows your app to render JSX files as views
const methodOverride = require('method-override') // Lets you use HTTP verbs like PUT and DELETE from forms (which normally only support GET and POST).

// load route files 
const userRoutes = require('./controllers/auth/routeController')
const engineersRouter = require('./controllers/engineers/routeController')

// Creates the Express app
const app = express()

// set up jsx view 
// Tells Express: “When rendering a page, use .jsx files and the JSX engine.”
app.set('view engine', 'jsx')
app.engine('jsx', jsxEngine())


// adds middleware 
app.use(express.json())
// this line baically tells express: "Hey, if someone submits a form to my server, 
// please take the data from that form and put it neatly into req.body so I can use it."
// Without this line, req.body would be undefined, and your server wouldn’t know what the user submitted.
// middleware to give us the body of the request data the user filled out
app.use(express.urlencoded({ extended: true })) // req.body
// Allow PUT and DELETE using ?_method=PUT or ?_method=DELETE
app.use(methodOverride('_method'))

// This is a custom middleware that runs before every route.
// When you're separating data logic (dataController) and view rendering (viewController), 
// you need a way to share the result between them. That’s where res.locals comes in — it's 
// like a shared storage space just for that request.
app.use((req, res, next) => { // applies the logic to all incoming requests
  res.locals.data = {} // Creates a blank object on res.locals.data to store shared data
  next() // Moves on to the next middleware or route handler
})
app.use(express.static('public')) // tells to check the public file before the route 
app.use(morgan('dev')) // Automatically logs each incoming request in the terminal.

// Tells Express:
// Any request starting with /users should go to userRoutes
// Any request starting with /fruits should go to fruitsRouter
app.use('/users', userRoutes)
app.use('/engineers', engineersRouter)

module.exports = app