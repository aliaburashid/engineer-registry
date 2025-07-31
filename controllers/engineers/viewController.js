const RESOURCE_PATH = '/engineers' // The base path for routes

const viewController = {
  signUp(req, res, next) {
    res.render('auth/SignUp') // Path to your signup view
  },
  signIn(req, res, next) {
    res.render('auth/SignIn') // Path to your signin view
  },
  index(req, res, next) {
    res.render('engineers/Index', res.locals.data) // Shows all engineers
  },
  show(req, res, next) {
    res.render('engineers/Show', res.locals.data) // Shows one engineer
  },
  edit(req, res, next) {
    res.render('engineers/Edit', res.locals.data) // Edit form
  },
  newView(req, res, next) {
    res.render('engineers/New', res.locals.data) // New form
  },
  redirectHome(req, res, next) {
    // It's meant to redirect the user to the homepage of a resource (in this case, /engineers).
    // Redirects after actions like login or create

    // Checks if there's a JWT token stored in res.locals.data.token.
    if (res.locals.data.token) {
        // If yes, it means the user just logged in and needs that token included in the URL.
      res.redirect(`${RESOURCE_PATH}?token=${res.locals.data.token}`)
    } else {
      res.redirect(RESOURCE_PATH)
    }
  },
  redirectShow(req, res, next) {
    // Redirects to a specific engineer's page
    if (res.locals.data.token) {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${res.locals.data.token}`)
    } else {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}`)
    }
  }
}

module.exports = viewController
