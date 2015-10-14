var express = require('express');
var router = express.Router();
require('../model/station.js');
var mongoose = require('mongoose');
var Station = mongoose.model('Station');

/* GET users listing. */
router.get('/', function(req, res, next) {
	
	Station.find({}, function(error, stations) {
		if (error) {
			res.send(error);
		}

		res.json(stations);
	});
});

router.delete('/:id', function(req, res, next) {
	var id = req.params.id;

	Station.findById(id).exec(function(error, station) {
		if (error) return next(error);
		if (!station) return next(new Error('failed to load station'));

		station.remove(function(error) {
			if (error) return next(error);
			res.json(station);
		})
	})
});

module.exports = router;