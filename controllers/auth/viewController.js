const viewController = {
    // Renders the Sign Up page located at: views/auth/SignUp.jsx
  signUp(req, res, next){
    res.render('auth/SignUp')
  },
  // Renders the Sign In page from: views/auth/SignIn.jsx
  signIn(req, res, next){
    res.render('auth/SignIn')
  },
  apiAuth(req, res, next){
    res.json({user: req.user, token: res.locals.data.token})
  },
  // If a user tries to access a protected route without being logged in,
  //  this redirects them to the login page.
  // Basically, Redirect unauthenticated users to the login page
  redirectToLogin(req, res, next){
    res.redirect('/users/login')
  }

}

module.exports = viewController