var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Station = mongoose.model('Station');
var PriceData = mongoose.model('PriceData');

router.get('/', function(req, res, next) {
	var from = req.query.from,
		to = req.query.to;

		console.log('from: %s, to: %s', from, to);

		//price = getPrice(from, to);

		PriceData.find({ from: from, to: to}, function(err, price) {
			if (err) return next(err);
			console.log('inside cb');
			res.json(price);
		});

		//console.log('price is: %d', price);

		//res.json({ message: 'no match!'});
})

function getPrice(from, to) {
      
	  var priceMatrix = {
	    Aalborg: { Aarhus: 175, Odense: 225, Copenhagen: 340, Randers: 150, Roskilde : 310 },
	    Aarhus: { Aalborg: 175, Odense: 225, Copenhagen: 340, Randers: 150, Roskilde : 310 },
	    Odense: { Aarhus: 175, Aalborg: 225, Copenhagen: 340, Randers: 150, Roskilde : 310 },
	    Copenhagen: { Aarhus: 175, Odense: 225, Aalborg: 340, Randers: 150, Roskilde : 55 },
	    Randers: { Aarhus: 175, Odense: 225, Aalborg: 340, Copenhagen: 150, Roskilde : 310 },
	    Roskilde: { Aarhus: 175, Odense: 225, Aalborg: 340, Randers: 150, Copenhagen : 55 }
	  }

	  return priceMatrix[from][to];
  }

module.exports = router;