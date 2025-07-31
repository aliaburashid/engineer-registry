const Engineer = require('../../models/engineer.js')

// This controller sends back JSON responses for API routes (not views).
//  It’s usually used when building an API that a front-end app or third-party service will consume.

const apiController = {
    // Returns a list of engineers belonging to the authenticated user.
    // gets the data from res.locals.data.engineers (populated in dataController.index).
    // Sends that list back as JSON.
  index(req, res) {
    res.json(res.locals.data.engineers)
  },

  // Get one engineer by ID
  // Comes from res.locals.data.engineer.
  show(req, res) {
    res.json(res.locals.data.engineer)
  },

  // After creating a new engineer
  // The engineer is in res.locals.data.engineer.
  create(req, res) {
    res.status(201).json(res.locals.data.engineer)
  },

  // After deleting an engineer
  // No need to send the deleted object — just a confirmation.
  destroy(req, res) {
    res.status(200).json({ message: 'Engineer successfully deleted' })
  }
}

module.exports = apiController
