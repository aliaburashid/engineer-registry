const express = require('express')
const router = express.Router()
const userApiController = require('../controllers/auth/apiController')
const engineerDataController = require('../controllers/engineers/dataController')
const engineerApiController = require('../controllers/engineers/apiController')

// User API
router.post('/users', userApiController.createUser)
router.post('/users/login', userApiController.loginUser)
router.get('/users/profile', userApiController.auth, userApiController.getProfile)
router.put('/users/:id', userApiController.auth, userApiController.updateUser)
router.delete('/users/:id', userApiController.auth, userApiController.deleteUser)

// Engineer API
router.get('/engineers', userApiController.auth, engineerDataController.index, engineerApiController.index)
router.get('/engineers/:id', userApiController.auth, engineerDataController.show, engineerApiController.show)
router.post('/engineers', userApiController.auth, engineerDataController.create, engineerApiController.create)
router.put('/engineers/:id', userApiController.auth, engineerDataController.update, engineerApiController.update)
router.delete('/engineers/:id', userApiController.auth, engineerDataController.destroy, engineerApiController.destroy)

module.exports = router
