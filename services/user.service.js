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

service.authenticate = authenticate;
service.getById = getById;
service.getAllUsers = getAllUsers;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

//------------------------------------------------------------
// ------------------------ API ------------------------------
//------------------------------------------------------------

//------------------------------------------------------------
//----------------- USER AUTHENTICATION ----------------------
//------------------------------------------------------------

function authenticate(userName, password) {
  var deferred = Q.defer();
  // get the user
  UserModel.findOne({
    userName: userName
  }, function (err, user) {
    if (err) {
      log.error('Login error! :(');
      deferred.reject(err);
    }
    if (user && bcrypt.compareSync(password, user.hash)) {
      // authentication successful
      log.info("Successful authentication! :)")
      deferred.resolve(jwt.sign({
        sub: user._id
      }, config.get('secret')));
    } else {
      // authentication failed
      log.error('Login error: Username or Password is incorrect! :(');
      deferred.resolve();
    }
  });
  return deferred.promise;
}

//------------------------------------------------------------
//-------------------- GET USER BY ID ------------------------
//------------------------------------------------------------

function getById(_id) {
  var deferred = Q.defer();

  UserModel.findById(_id, function (err, user) {
    if (err) {
      log.error("can not find user, error: ", err);
      deferred.reject(err)
    };

    if (user) {
      // return user (without hashed password)
      var userMap = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName
      }

      deferred.resolve(userMap); //_.omit(user, 'hash')
    } else {
      // user not found
      deferred.resolve();
    }
  });

  return deferred.promise;
}

//------------------------------------------------------------
//--------------------- GET ALL USERS ------------------------
//------------------------------------------------------------

function getAllUsers() {
  var deferred = Q.defer();

  UserModel.find(function (err, users) {
    if (err) {
      deferred.reject(err);
    }

    if (users) {
      // return users (without hashed password)
      // log.info(users);
      var usersMap = {};
      users.forEach(function (user) {
        usersMap[user._id] = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName
        };
      });
      // log.info(usersMap);
      deferred.resolve(usersMap);
    } else {
      // user not found
      deferred.resolve();
    }
  });

  return deferred.promise;
}

//------------------------------------------------------------
//---------------------- CREATE USER -------------------------
//------------------------------------------------------------

function create(userParam) {
  var deferred = Q.defer();

  UserModel.find({
    userName: userParam.userName
  }, function (err, user) {
    if (err) {
      log.error('Database error:', err.message);
      deferred.reject(err);
    }
    if (user.userName == userParam.userName) {
      // username already exists
      log.error(user);
      log.error('User is already taken!');
      deferred.reject('Username "' + userParam.userName + '" is already taken');
    } else {
      createUser();
    }
  });

  function createUser() {
    // create a new user
    var newUser = UserModel({
      firstName: userParam.firstName,
      lastName: userParam.lastName,
      userName: userParam.userName,
      hash: bcrypt.hashSync(userParam.password, 10)
    });
    // save the user
    newUser.save(function (err, doc) {
      if (err) {
        log.error('Can not create user, error:', err.message);
        deferred.reject(err);
      }
      log.info("User created successful! :)");
      deferred.resolve();
    });
  }

  return deferred.promise;
}

//------------------------------------------------------------
//---------------------- UPDATE USER -------------------------
//------------------------------------------------------------

function update(_id, userParam) {
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
//---------------------- REMOVE USER -------------------------
//------------------------------------------------------------

function _delete(_id) {
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