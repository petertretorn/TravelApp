var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Station = mongoose.model('Station');
var PriceData = mongoose.model('PriceData');

router.get('/', function(req, res, next) {
	var from = req.query.from,
		to = req.query.to;

	console.log('from: %s, to: %s', from, to);

	if (!from && !to) {
		PriceData.find({}, function(err, price) {
			if (err) return next(err);
			res.json(price);
		});
	}
	else {
		PriceData.find({ $or: [ { from: from, to: to }, { from: to, to: from }] }, function(err, price) {
			if (err) return next(err);
			res.json(price);
		});
	}
})

router.put('/:id', function(req, res, next) {
	var id = req.params.id;

	var body = req.body;

	console.log('route was hit: ' + id);
	console.log('new price: ' + body.price);

	PriceData.findById(id).exec(function(err, pd) {
		pd.price = body.price;

		pd.save(function(err) {
			if (err) res.status(400).send({ message: 'error occured' });
			res.json(pd);
		});
	});
});

module.exports = router;