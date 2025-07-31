const express = require('express');
const router = express.Router();

// Load controllers
const viewController = require('./viewController.js');
const dataController = require('./dataController.js');
const authDataController = require('../auth/dataController.js');

// ---------- ROUTES ---------- //

//authDataController.auth This middleware checks:
// Is there a token in the request (either query or headers)?
// If yes, it verifies the token and sets req.user
// Makes sure all engineer routes are only accessible when logged in

// GET /engineers → Show list of this user's engineers
router.get('/', authDataController.auth
    /* check if the token exists in the header or the query, set req.user and res.locals.data.token */ , 
    dataController.index
    /*grab and save the logged in user's engineers */, 
    viewController.index
    /* display the logged in users engineers and also the link to the new page with the token*/
);

// GET /engineers/new → Form to create a new engineer
router.get(
  '/new',
  authDataController.auth,
  viewController.newView
);

// DELETE /engineers/:id → Delete one engineer
router.delete(
  '/:id',
  authDataController.auth,
  dataController.destroy,
  viewController.redirectHome
);

// PUT /engineers/:id → Update engineer info
router.put(
  '/:id',
  authDataController.auth,
  dataController.update,
  viewController.redirectShow
);

// POST /engineers → Create new engineer and link to user
router.post(
  '/',
  authDataController.auth,
  dataController.create,
  viewController.redirectHome
);

// GET /engineers/:id/edit → Edit form for one engineer
router.get(
  '/:id/edit',
  authDataController.auth,
  dataController.show,
  viewController.edit
);

// GET /engineers/:id → Show details for one engineer
router.get(
  '/:id',
  authDataController.auth,
  dataController.show,
  viewController.show
);

// Export router
module.exports = router;
