(function () {
  'use strict';

  angular
    .module('app')
    .controller('Friends.IndexController', Controller);

  function Controller(FriendsService, UserService, FlashService) {
    var vm = this;

    vm.user = null;
    vm.users = null;
    vm.userFriends = null;
    vm.addToFriends = addToFriends;
    vm.removeFromFriends = removeFromFriends;
    vm.getAllUsers = getAllUsers;
    vm.isFriends = isFriends;


    initController();

    function initController() {
      // get current user
      UserService.GetCurrent().then(function (user) {
        vm.user = user;
      });
      getAllUsers();
    }

    function getAllUsers() {
      // get all users
      UserService.GetAll().then(function (users) {
        vm.users = users;
        // get all user friends
        getAllFriends(users)
      });
    }

    function addToFriends(user) {
      var currentUser = vm.user;
      var addingUser = user
      var request = {
        currentUser: currentUser,
        addingUser: addingUser
      };

      FriendsService.addToFriends(request)
        .then(function () {
          FlashService.Success('User added to friends! :)');
          getAllUsers()
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
    }

    function removeFromFriends(user) {
      var currentUser = vm.user;
      var removingUser = user;
      var request = {
        currentUser: currentUser,
        removingUser: removingUser
      };
      FriendsService.removeFromFriends(request)
        .then(function () {
          FlashService.Success('User removed from friends! :)');
          getAllUsers()
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
    }

    function getAllFriends(users) {
      FriendsService.getAllUserFriends(vm.user._id).then(function (userFriends) {
        vm.userFriends = userFriends;
        vm.isFriends(users, userFriends);
      });
    }

    function isFriends(users, userFriends) {
      var s = 0;
      for (var user in users) {
        for (var i = 0; i < userFriends.length; i++) {
          if (users[user].userName == userFriends[i].userName) {
            users[user].isFriend = true;
          }
        }
      }
    }


  }

})();