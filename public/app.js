'use strict'

angular.module('TravelApp', []);

angular.module('TravelApp').controller('AdminController', AdminController);

function AdminController() {
	var vm = this;

	vm.message = 'getting started!';
}