var libs          =   process.cwd() + '/libs/';
var config        =   require(libs + 'config');
var express       =   require('express');
var router        =   express.Router();
var userService   =   require('services/user.service');

// routes
router.post('/add',  addToFriends);
router.post('/remove',      removeFromFriends);

module.exports = router;

//------------------------------------------------------------
// ------------------------ API ------------------------------
//------------------------------------------------------------

//------------------------------------------------------------
//----------------- ADD USER TO FRIENDS ----------------------
//------------------------------------------------------------

function addToFriends(req, res) {
  var userId = req.user.sub;
  if (req.params._id !== userId) {
    // can only delete own account
    return res.status(401).send('You can only delete your own account');
  }

  userService.addToFriends(userId)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

//------------------------------------------------------------
//--------------- REMOVE USER FROM FRIENDS -------------------
//------------------------------------------------------------

function removeFromFriends(req, res) {
  var userId = req.user.sub;
  if (req.params._id !== userId) {
    // can only delete own account
    return res.status(401).send('You can only delete your own account');
  }

  userService.removeFromFriends(userId)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

//------------------------------------------------------------
// ----------------------- END API ---------------------------
//------------------------------------------------------------