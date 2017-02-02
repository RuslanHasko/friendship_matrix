var mongoose  = require('mongoose');

var FriendsOfFriends = require('friends-of-friends');
var fof_options = { 
    personModelName:            'User',
    friendshipModelName:        'Friend_Relationships', 
    friendshipCollectionName:   'friendshipCollection',
};
var friendsOfFriends = new FriendsOfFriends(mongoose, fof_options);

Schema = mongoose.Schema,

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
  }
});

// apply the friends-of-friends mongoose plugin to your User schema
User.plugin(friendsOfFriends.plugin, fof_options);

// compile your user model
var User = mongoose.model(fof_options.personModelName, User);

// var User = mongoose.model('User', User);

module.exports.User = User;