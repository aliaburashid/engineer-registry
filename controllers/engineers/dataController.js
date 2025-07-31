const Engineer = require('../../models/engineer.js');

const dataController = {}

// Gets all engineers connected to the logged-in user
dataController.index = async (req, res, next) => {
    try {
        // Uses .populate('engineers') to replace engineer IDs with full engineer data
        const user = await req.user.populate('engineers')
        // take the enginner data and store it in res.locals so can be shared to view controller
        res.locals.data.engineers = user.engineers
        next()
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

// Delete a specific engineer
dataController.destroy = async (req, res, next) => {
    try {
        // Deletes one engineer from the database using its ID
        await Engineer.findOneAndDelete({ '_id': req.params.id })
        next()
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

// Update an engineer's info
dataController.update = async (req, res, next) => {
  try {
    // Convert checkbox value to Number again when updating
    req.body.yearsExperience = req.body.yearsExperience === 'on' ? 1 : 0

    res.locals.data.engineer = await Engineer.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    next()
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}


// Create a new engineer and add it to the user’s list
dataController.create = async (req, res, next) => {
  try {
    // Convert checkbox value to Number (1 if checked, 0 if not)
    req.body.yearsExperience = req.body.yearsExperience === 'on' ? 1 : 0

    res.locals.data.engineer = await Engineer.create(req.body)
    req.user.engineers.addToSet({ _id: res.locals.data.engineer._id })
    await req.user.save()
    next()
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}


// Show details of one engineer
dataController.show = async (req, res, next) => {
    try {
        // Finds one specific engineer by ID and store it in res.locals
        res.locals.data.engineer = await Engineer.findById(req.params.id)
        // If not found, throws an error
        if (!res.locals.data.engineer) {
            throw new Error('No engineer with that ID is in our database')
        }
        next()
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = dataController
