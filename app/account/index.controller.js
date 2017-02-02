(function () {
  'use strict';

  angular
    .module('app')
    .controller('Account.IndexController', Controller);

  function Controller($window, UserService, FlashService) {
    var vm = this;

    vm.user = null;
    vm.saveUser = saveUser;
    vm.deleteUser = deleteUser;
    vm.editUser = false;

    initController();

    function initController() {
      // get current user
      UserService.GetCurrent().then(function (user) {
        vm.user = user;
      }); 
    }

    function saveUser() {
      UserService.Update(vm.user)
        .then(function () {
          FlashService.Success('User updated');
          vm.editUser = !vm.editUser;
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
    }

    function deleteUser() {
      UserService.Delete(vm.user._id)
        .then(function () {
          // log user out
          $window.location = '/login';
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
    }
  }

})();