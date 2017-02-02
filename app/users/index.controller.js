(function () {
  'use strict';

  angular
    .module('app')
    .controller('Users.IndexController', Controller);

  function Controller($window, UserService, FlashService) {
    var vm = this;

    vm.users = null;

    initController();

    function initController() {
      // get all users
      UserService.GetAll().then(function (users) {
        vm.users = users;
      });
    }  

  }

})();