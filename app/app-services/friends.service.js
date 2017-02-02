(function () {
  'use strict';

  angular
    .module('app')
    .factory('FriendsService', Service);

  function Service($http, $q) {
    var service = {};

    service.addToFriends = addToFriends;
    service.removeFromFriends = removeFromFriends;

    return service;

    function addToFriends(user) {
      return $http.put('/api/friends/add' + user._id, user).then(handleSuccess, handleError);
    }

    function removeFromFriends(user) {
      return $http.delete('/api/friends/remove' + user._id, user).then(handleSuccess, handleError);
    }

    // private functions

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }
  }

})();