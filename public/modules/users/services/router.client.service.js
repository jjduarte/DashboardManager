'use strict';

angular.module('users').factory('UserService', function () {

  var currentUser = window.user;

  var adminRoles = ['1', '2'];
  var otherRoles = ['3'];


  return {
    // some code that gets and sets the user to the singleton variable...

    validateRoleAdmin: function () {
      if(currentUser !== undefined){
        return !!~adminRoles.indexOf(currentUser.RoleUser.toString());
      } else{
        return false;
      }
    },

    validateRoleOther: function () {
     if(currentUser !== undefined){
      return !!~otherRoles.indexOf(currentUser.RoleUser.toString());
     } else {
      return false;
     }
    }
  };
});
