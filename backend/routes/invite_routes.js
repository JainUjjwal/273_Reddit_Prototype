const express = require("express");
const router = express.Router();
const inviteController = require('../controllers/invite_controller')
const { checkAuth } = require("../config/passport");


// create a send invite as owner
router.post("/invite_user",  inviteController.sendInvite);


module.exports = router;