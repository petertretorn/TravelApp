var stationModule = require('./model/station.js');

var mongoose = require('mongoose');
var Station = mongoose.model('Station');
var PriceData = mongoose.model('PriceData');

function purgeData() {
	mongoose.connect('mongodb://localhost/travelapp');

	console.log('inside purgeData');

	Station.remove({}, function(err) {
		if (err) console.log('failed to remove stations!');
	});


	PriceData.remove({}, function(err) {
		if (err) console.log('failed to remove pricedata');
	});
}


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

function createPriceData() {
	Station.find({}, function(err, stations) {
		if (err) {
			console.log('failed to fetch stations');
			process.exit(0);
		}
		
		var stationNames = stations.map(function(station) {
			return station.name;
		});

		for (var i = 0; i < stationNames.length; i++) {
			var from = stationNames[i];

			for (var j = i; j < stationNames.length; j++) {
				if (i == j) continue;

				var to = stationNames[j];

				var price = getRandomInt(100, 600);

				var priceData = new PriceData({ from: from, to: to, price: price});

				priceData.save(function(err) {
					if (err) console.log('failed');
				})
			}			
		}
	})
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function test() {
	console.log('just testing...');
}

mongoose.connection.close();

 //purgeData()

 //createStations()

 //createPriceData()

 module.exports = {
 	purgeData: purgeData,
 	createStations: createStations,
 	createPriceData: createPriceData,
 	test: test
 }
 