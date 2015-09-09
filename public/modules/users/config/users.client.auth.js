'use strict';

angular.module('users').run(function ($rootScope, $location, Authentication, UserService) {

  // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/'];
  var routesThatForAdmins = ['/users', '/users/create', '/users/:userId', '/users/:userId/edit'];

  // check if route does not require authentication
  var routeClean = function(route) {  
    return  !!~routesThatDontRequireAuth.indexOf(route);
  };
  // check if route requires admin priviledge
  var routeAdmin = function(route) {
    return  !!~routesThatForAdmins.indexOf(route);
  };

  $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
    if (!routeClean($location.url()) && !Authentication.user) {
      // redirect back to login
      $location.path('/');
    }
    else if (routeAdmin($location.url()) && !UserService.validateRoleAdmin()) {
      // redirect to error page
      $location.path('/');
    }
  });
});
