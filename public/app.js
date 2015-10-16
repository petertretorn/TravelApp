'use strict'

angular.module('TravelApp', []);

angular.module('TravelApp').controller('AdminController', AdminController);

AdminController.$inject = ['dataService'];

function AdminController(dataService) {
	var vm = this;

	vm.priceData = [];

	dataService.getPriceData().then(onSuccess, errorHandler);

	function onSuccess(data) {
		vm.priceData = data;
	}

	function errorHandler() {
		console.log('error')
	}

	vm.editPriceData = function(priceData) {
		vm.selected = angular.copy(priceData);
	}

	vm.savePriceData = function(priceData) {
		console.log('inside savePriceData')
		vm.selected = {};		
		dataService.updatePriceData(priceData).then(priceUpdated, errorHandler);
	}

	function priceUpdated(res) {
		console.log('pricedata updated: ' + res);
	}

	vm.selected = {};

	vm.getTemplate = function(pd) {
		if (pd._id === vm.selected._id) return 'edit';
		else return 'display'
	}
}

angular.module('TravelApp').factory('dataService', dataService);

dataService.$inject = ['$http', 'settings'];

function dataService($http, settings) {

	return {
		getPriceData: getPriceData,
		updatePriceData: updatePriceData
	}

	function getPriceData() {

		return $http.get(settings.baseUrl + '/priceData').then(function(response) {
			return response.data;
		});
	}

	function updatePriceData(pd) {
		return $http.put(settings.baseUrl + '/pricedata/' + pd._id, pd).then(function(response) {
			return response.data;
		})
	}
}

angular.module('TravelApp').constant('settings', {
	baseUrl: 'http://localhost:3000'
});