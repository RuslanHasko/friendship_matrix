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

module.exports = service;

//------------------------------------------------------------
// ------------------------ API ------------------------------
//------------------------------------------------------------

//------------------------------------------------------------
//----------------- ADD USER TO FRIENDS ----------------------
//------------------------------------------------------------

function addToFriends(_id, userParam) {
  var deferred = Q.defer();

  // validation
  UserModel.findById(_id, function (err, user) {
    if (err) deferred.reject(err);

    if (user.userName !== userParam.userName) {
      // username has changed so check if the new username is already taken
      UserModel.findOne({
          userName: userParam.userName
        },
        function (err, user) {
          if (err) deferred.reject(err);

          if (user.userName = userParam.userName) {
            // username already exists
            log.error('Username "' + userParam.userName + '" is already taken');
            deferred.reject('Username "' + userParam.userName + '" is already taken');
          } else {
            updateUser(user);
          }
        });
    } else {
      updateUser(user);
    }
  });

  function updateUser(user) {
    // fields to update
    user.firstName = userParam.firstName;
    user.lastName = userParam.lastName;
    user.userName = userParam.userName;
    user.hash = bcrypt.hashSync(userParam.password, 10);

    // save the user
    user.save(function (err) {
      if (err) {
        log.error("Error: ", err);
        deferred.reject(err);
      };

      log.info('User successfully updated!');
      deferred.resolve();
    });
  }

  return deferred.promise;
}

//------------------------------------------------------------
//--------------- REMOVE USER FROM FRIENDS -------------------
//------------------------------------------------------------

function removeFromFriends(_id) {
  var deferred = Q.defer();

  UserModel.findByIdAndRemove(_id, function (err) {
    if (err) {
      log.error("Can not delete user! Error: ", err);
      if (err) deferred.reject(err);
    };

    log.info("user successfully deleted!");
    deferred.resolve();
  });

  return deferred.promise;
}

//------------------------------------------------------------
// ----------------------- END API ---------------------------
//------------------------------------------------------------