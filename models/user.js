var mongoose  = require('mongoose');

Schema = mongoose.Schema,

Friend = new Schema({
  firstName: {
    type: String,
    unique: false,
    required: true
  },
  lastName: {
    type: String,
    unique: false,
    required: true
  },
  userName: {
    type: String,
    unique: true,
    required: true
  }
});

User  = new Schema({
  firstName: {
    type: String,
    unique: false,
    required: true
  },
  lastName: {
    type: String,
    unique: false,
    required: true
  },
  userName: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  friends: [Friend]
});

var User = mongoose.model('User', User);

module.exports.User = User;