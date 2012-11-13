'use strict';

var StripesFactoryv2App = angular.module('StripesFactoryv2App', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/popular', {
        templateUrl: 'views/popular.html',
        controller: 'PopularCtrl'
      })
      .when('/recent', {
        templateUrl: 'views/recent.html',
        controller: 'RecentCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
