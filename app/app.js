(function () {
  'use strict';

  angular
    .module('app', ['ui.router'])
    .config(config)
    .run(run);

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    // default route
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/index.html',
        controller: 'Home.IndexController',
        controllerAs: 'vm',
        data: {
          activeTab: 'home'
        }
      })
      .state('account', {
        url: '/account',
        templateUrl: 'account/index.html',
        controller: 'Account.IndexController',
        controllerAs: 'vm',
        data: {
          activeTab: 'account'
        }
      })
      .state('users', {
        url: '/users',
        templateUrl: 'users/index.html',
        controller: 'Users.IndexController',
        controllerAs: 'vm',
        data: {
          activeTab: 'users'
        }
      })
      .state('friends', {
        url: '/friends',
        templateUrl: 'friends/index.html',
        controller: 'Friends.IndexController',
        controllerAs: 'vm',
        data: {
          activeTab: 'friends'
        }
      });

    if (window.history && window.history.pushState) {
      $locationProvider.html5Mode({
        enabled: true
      });
    }

  };

  function run($http, $rootScope, $window, $browser) {
    $browser.baseHref = function () { return "/" };
    // add JWT token as default auth header
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    // update active tab on state change
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.activeTab = toState.data.activeTab;
    });
  }

  // manually bootstrap angular after the JWT token is retrieved from the server
  $(function () {
    // get JWT token from server
    $.get('/app/token', function (token) {
      window.jwtToken = token;

      angular.bootstrap(document, ['app']);
    });
  });
})();