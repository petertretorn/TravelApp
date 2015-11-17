(function() {
  "use strict";
  
  angular.module('app').value('appSettings', {
    offline: false,
    baseUrl: 'http://localhost:3000/'
  });
  
}());