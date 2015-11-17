(function() {
  "use strict";
  
  /* -------------------------dataService------------------- */
  
  angular.module('app').factory('dataService', dataService);
  
  function dataService(appSettings, offlineDataService, httpDataService) {
    return appSettings.offline ? offlineDataService : httpDataService;
  }
  dataService.$inject = ['appSettings', 'offlineDataService', 'httpDataService']
  
  /* -------------------------httpDataService---------------- */
  
  angular.module('app').factory('httpDataService', httpDataService);
  
  function httpDataService($http, appSettings) {
    return {
      getDestinations: getDestinations,
      getPrice: getPrice,
    }
    
    function getPrice(from, to) {
      var url = appSettings.baseUrl + 'pricedata' + '?from=' + from + '&to=' + to;
      return $http.get(url).then(function(response) {
        return response.data[0].price;
      });
    }
    
    function getDestinations() {
      return $http.get(appSettings.baseUrl + 'stations').then(function(response) {
        return _mapStationsResponse(response.data);
      });
    }
    
    function _mapStationsResponse(stationDTOs) {
      var stations = [];
      
      stationDTOs.forEach(function(stationDTO) {
        stations.push(stationDTO.name)
      });
      
      return stations;
    }
  }
  
  httpDataService.$inject = ['$http', 'appSettings'];
  
  /* -------------------------offlineDataService---------------- */
  
  angular.module('app').factory('offlineDataService', offlineDataService);
  
  function offlineDataService($q) {
    return {
      getDestinations: getDestinations,
      getPrice: getPrice,
    }

    function getDestinations() {
      var destinations= ['Aalborg', 'Aarhus', 'Odense', 'Copenhagen', 'Roskilde', 'Randers'];
      var deferred = $q.defer();
      deferred.resolve(destinations);
      return deferred.promise;
    }
    
    function getPrice(from, to) {
      
      var priceMatrix = {
        Aalborg: { Aarhus: 175, Odense: 225, Copenhagen: 340, Randers: 150, Roskilde : 310 },
        Aarhus: { Aalborg: 175, Odense: 225, Copenhagen: 340, Randers: 150, Roskilde : 310 },
        Odense: { Aarhus: 175, Aalborg: 225, Copenhagen: 340, Randers: 150, Roskilde : 310 },
        Copenhagen: { Aarhus: 175, Odense: 225, Aalborg: 340, Randers: 150, Roskilde : 55 },
        Randers: { Aarhus: 175, Odense: 225, Aalborg: 340, Copenhagen: 150, Roskilde : 310 },
        Roskilde: { Aarhus: 175, Odense: 225, Aalborg: 340, Randers: 150, Copenhagen : 55 }
      }
      
      var price = priceMatrix[from][to];
      
      var deferred = $q.defer();
      deferred.resolve(price);
      return deferred.promise;
    }
  }

  offlineDataService.$inject = ['$q'];
  
  /* -------------------------travelService---------------- */
  
  angular.module('app').factory('travelService', travelService);
  
  function travelService(userService, dataService) {
    return {
      checkIn: checkIn,
      checkOut: checkOut
    }
    
    function checkIn(location) {
      userService.currentTravel.from = location;
      userService.currentTravel.checkedIn = true;
    }
    
    function checkOut(destination) {
      userService.currentTravel.checkedIn = false;
      
      var from = userService.currentTravel.from;
      userService.currentTravel = {};
      
      return dataService.getPrice(from, destination).then(function(price) {
        userService.creditBalance -=  price;
        userService.travelLog.push( { from: from, to: destination, price: price });
        return price;
      });
    }
  }
  
  travelService.$inject = ['userService', 'dataService'];
  
  /* -------------------------toastService---------------- */
  
  angular.module('app').factory('toastService', toastService);
  
  function toastService($modal) {
    
    return {
      showToast: showToast
    };
    
    function showToast(message) {
      var modalInstance = $modal.open({
          templateUrl: 'modal.html',
          controller: function($scope, $modalInstance) {
            $scope.message = message;
            $scope.ok = function() {
              $modalInstance.close();
            }
          }
        });
    }
  }
  toastService.$inject = ['$modal'];
  
  /* -------------------------userService---------------- */
  
  angular.module('app').factory('userService', userService);

  function userService() {
    return {
      currentTravel: currentTravel,
      travelLog: travelLog,
      creditBalance: creditBalance
    }
    
    var currentTravel = {};
    var travelLog = [];
    var creditBalance = 0;
  }

}());