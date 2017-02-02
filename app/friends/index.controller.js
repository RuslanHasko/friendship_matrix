(function () {
  'use strict';

  angular
    .module('app')
    .controller('Friends.IndexController', Controller);

  function Controller(FriendsService, UserService) {
    var vm = this;

    vm.users = null;

    initController();

    function initController() {
      // get all users
      UserService.GetAll().then(function (users) {
        vm.users = users;
      });
    }

    function addToFriends() {
      FriendsService.addToFriends(vm.user)
        .then(function () {
          FlashService.Success('User added to friends! :)');
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
    }

    function removeFromFriends() {
      FriendsService.removeFromFriends(vm.user)
        .then(function () {
          FlashService.Success('User removed from friends! :)');
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
    }


  }

})();