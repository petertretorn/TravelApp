var stationModule = require('./model/station.js');

var mongoose = require('mongoose');
var Station = mongoose.model('Station');
var PriceData = mongoose.model('PriceData');

function createStations() {
	var stations = ['Aalborg', 'Odense', 'Århus', 'Copenhagen', 'Svendborg', 'Randers', 'Thisted', 'Esbjerg'];

	stations.forEach(function(station) {
		var mongoStation = new Station({ name: station });

		mongoStation.save(function(error) {
			if (error) console.log('Could not save station');
			else console.log('saved %s...', station);
		});
	})
}

//createStations();

var pd = new PriceData({ from: 'Aalborg', to: 'Copenhagen', price: 542 });
pd.save(function(err) {
	if (err) console.log('failed');
	else console.log('success');
})

function createPriceData() {

}

createPriceData();