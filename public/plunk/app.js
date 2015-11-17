(function() {
  "use strict";

  angular.module('app', ['ui.bootstrap', 'ngRoute'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'main.html',
          controller: 'MainController',
          controllerAs: 'vm'
        })
        .when('/account', {
          templateUrl: 'account.html',
          controller: 'AccountController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/'
        });
    })
    .run(function(userService) {
      userService.currentTravel = {
        from: '',
        to: '',
        checkedIn: false
      };
      userService.travelLog = [];
      userService.creditBalance = 3000;
    });

  /* ------------------------------MainController------------------------- */

  angular.module('app').controller('MainController', MainController)

  function MainController($location, $cacheFactory, dataService, travelService, toastService, userService) {

    var vm = this,
      dataCache = $cacheFactory.get('travelCardCache');

    vm.allDestinations = vm.toDestinations = [];

    init();

    function init() {
      vm.checkedIn = userService.currentTravel.checkedIn;
      vm.travel = angular.copy(userService.currentTravel);

      if (!dataCache) {
        dataCache = $cacheFactory('travelCardCache');
      }
      var stationsFromCache = dataCache.get('stations');

      if (stationsFromCache) {
        console.log('cached stations: ' + stationsFromCache);
        vm.allDestinations = stationsFromCache;
        checkDestinationFilterCondition();
      } else {
        dataService.getDestinations().then(onStationsFetchSuccess, onStationsFetchError);
      }
    }

    function onStationsFetchSuccess(data) {
      vm.allDestinations = data;
      dataCache.put('stations', data);
      checkDestinationFilterCondition();
    }

    function onStationsFetchError(error) {
      console.log('error: ' + error);
    }

    function checkDestinationFilterCondition() {
      if (vm.checkedIn) {
        filterCheckOutDestinations();
      }
    }

    function filterCheckOutDestinations() {
      vm.toDestinations = angular.copy(vm.allDestinations);
      var index = vm.toDestinations.indexOf(vm.travel.from);
      vm.toDestinations.splice(index, 1);
    }

    vm.checkIn = function() {
      vm.checkedIn = true;
      travelService.checkIn(vm.travel.from);

      filterCheckOutDestinations();

      toastService.showToast('You\'ve checked in successfully!');
    }

    vm.checkOut = function() {
      vm.checkedIn = false;

      travelService.checkOut(vm.travel.to).then(function(price) {
        var balance = userService.creditBalance;
        toastService.showToast('You have checked out succesfully! Price of travel is kr. ' + price + '. Remaining amount on account is kr. ' + balance);
        vm.travel.from = '';
        vm.travel.to = '';
      }, function(error) {
        toastService.showToast('Checkout failed. Call and complain...');
      });
    }

    vm.onChangeFromStation = function() {
      userService.currentTravel.from = vm.travel.from;
    }

    vm.onChangeToStation = function() {
      userService.currentTravel.to = vm.travel.to;
    }
  }

  MainController.$inject = ['$location', '$cacheFactory', 'dataService', 'travelService', 'toastService', 'userService']

  /* ------------------------------AccountController------------------------- */

  angular.module('app').controller('AccountController', AccountController);

  function AccountController(userService) {
    var vm = this;

    vm.travels = userService.travelLog;
    vm.balance = userService.creditBalance;
  }

  AccountController.$inject = ['userService'];

}());