(function () {
  'use strict';

  angular
    .module('app')
    .factory('FriendsService', Service);

  function Service($http, $q) {
    var service = {};

    service.addToFriends = addToFriends;
    service.removeFromFriends = removeFromFriends;
    service.getAllUserFriends = getAllUserFriends;

    return service;

    function addToFriends(request) {
      return $http.put('/api/friends/add', request).then(handleSuccess, handleError);
    }

    function removeFromFriends(request) {
      return $http.put('/api/friends/remove', request).then(handleSuccess, handleError);
    }

    function getAllUserFriends(_id) {
      return $http.get('/api/friends/all/' + _id).then(handleSuccess, handleError);
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