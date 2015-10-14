var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Station = mongoose.model('Station');
var PriceData = mongoose.model('PriceData');

router.get('/', function(req, res, next) {
	var from = req.query.from,
		to = req.query.to;

	console.log('from: %s, to: %s', from, to);

	PriceData.find({ $or: [ { from: from, to: to }, { from: to, to: from }] }, function(err, price) {
		if (err) return next(err);
		res.json(price);
	});
})

module.exports = router;