(function () {
  'use strict';

  angular
    .module('app')
    .controller('Users.IndexController', Controller);

  function Controller($window, UserService, FlashService) {
    var vm = this;

    vm.users = null;
    vm.user = null;

    initController();

    function initController() {
      // get current user
      UserService.GetCurrent().then(function (user) {
        vm.user = user;
      });
      // get all users
      UserService.GetAll().then(function (users) {
        vm.users = users;
      });
    }  

  }

})();