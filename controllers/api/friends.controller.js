var libs          =   process.cwd() + '/libs/';
var config        =   require(libs + 'config');
var log = require(libs + 'log')(module);
var express       =   require('express');
var router        =   express.Router();
var friendsService   =   require('services/friends.service');

// routes
router.put('/add',        addToFriends);
router.put('/remove',     removeFromFriends);
router.get('/all/:_id',   getAllUserFriends);

module.exports = router;

//------------------------------------------------------------
// ------------------------ API ------------------------------
//------------------------------------------------------------

//------------------------------------------------------------
//----------------- ADD USER TO FRIENDS ----------------------
//------------------------------------------------------------

function addToFriends(req, res) {  
  friendsService.addToFriends(req.body.currentUser, req.body.addingUser)
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
  friendsService.removeFromFriends(req.body.currentUser, req.body.removingUser)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

//------------------------------------------------------------
//------------------ GET USER FRIEND LIST --------------------
//------------------------------------------------------------

function getAllUserFriends(req, res) {
  friendsService.getAllUserFriends(req.user.sub)
    .then(function (allFriendsList) {
      if (allFriendsList) {
        res.send(allFriendsList);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

//------------------------------------------------------------
// ----------------------- END API ---------------------------
//------------------------------------------------------------