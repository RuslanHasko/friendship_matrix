var libs = process.cwd() + '/libs/';
var models = process.cwd() + '/models/';
var config = require(libs + 'config');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var log = require(libs + 'log')(module);
var db = require('mongoose.js');
var mongoose = require('mongoose');
var UserModel = require(models + 'user').User;

var service = {};

service.addToFriends = addToFriends;
service.removeFromFriends = removeFromFriends;
service.getAllUserFriends = getAllUserFriends;

module.exports = service;

//------------------------------------------------------------
// ------------------------ API ------------------------------
//------------------------------------------------------------

//------------------------------------------------------------
//----------------- ADD USER TO FRIENDS ----------------------
//------------------------------------------------------------

function addToFriends(currentUser, addingUser) {
  var deferred = Q.defer();

  UserModel.findById(currentUser._id, function (err, userCur) {
    if (err) {
      log.error("Can not find current user, error: ", err);
      deferred.reject(err);
    }
    UserModel.findById(addingUser._id, function (err, userAdd) {
      if (err) {
        log.error("Can not find adding user, error: ", err);
        deferred.reject(err);
      }
      addFriend(userCur, userAdd)
    });
  });

  function addFriend(userCur, userAdd) {

    userCur.friends.push({
      _id: userAdd._id,
      firstName: userAdd.firstName,
      lastName: userAdd.lastName,
      userName: userAdd.userName
    });
    userAdd.friends.push({
      _id: userCur._id,
      firstName: userCur.firstName,
      lastName: userCur.lastName,
      userName: userCur.userName
    });

    // save the user
    userCur.save(function (err) {
      if (err) {
        log.error("Error: ", err);
        deferred.reject(err);
      };
      userAdd.save(function (err) {
        if (err) {
          log.error("Error: ", err);
          deferred.reject(err);
        };
        log.info('Friend added successfull!');
        deferred.resolve();
      });
    });
  }

  return deferred.promise;
}

//------------------------------------------------------------
//--------------- REMOVE USER FROM FRIENDS -------------------
//------------------------------------------------------------

function removeFromFriends(currentUser, removingUser) {
  var deferred = Q.defer();

  UserModel.findById(currentUser._id, function (err, userCur) {
    if (err) {
      log.error("Can not find current user, error: ", err);
      deferred.reject(err);
    }
    UserModel.findById(removingUser._id, function (err, userDel) {
      if (err) {
        log.error("Can not find adding user, error: ", err);
        deferred.reject(err);
      }
      remove(userCur, userDel);
    });
  });

  function remove(userCur, userDel) {
    for (var i = 0; i < userCur.friends.length; i++) {
      if (userCur.friends[i].userName == userDel.userName) {
        log.info("Friend removed! 1");
        userCur.friends.splice(i, 1);
      }
    }
    for (var i = 0; i < userDel.friends.length; i++) {
      if (userDel.friends[i].userName == userCur.userName) {
        log.info("Friend removed! 2");
        userDel.friends.splice(i, 1);
      }
    }
    // save the user
    userCur.save(function (err) {
      if (err) {
        log.error("Error: ", err);
        deferred.reject(err);
      };
      userDel.save(function (err) {
        if (err) {
          log.error("Error: ", err);
          deferred.reject(err);
        };
        log.info("Friend removed!");
        deferred.resolve();
      });
    });
  }

  return deferred.promise;
}

//------------------------------------------------------------
//------------------ GET USER FRIEND LIST --------------------
//------------------------------------------------------------

function getAllUserFriends(_id) {
  var deferred = Q.defer();

  UserModel.findById(_id, function (err, user) {
    if (err) {
      log.error("Can not find current user, error: ", err);
      deferred.reject(err);
    }
    getAllFriends(user);
  });

  function getAllFriends(user) {
    var friends = [];
    for (var i = 0; i < user.friends.length; i++) {
      friends.push(user.friends[i]);
    }
    log.info("All friends list getted!");
    deferred.resolve(friends);
  }
  return deferred.promise;
}
//------------------------------------------------------------
// ----------------------- END API ---------------------------
//------------------------------------------------------------