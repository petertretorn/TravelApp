var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/travelapp');

var stationSchema = new mongoose.Schema({
	name: String
});

var priceSchema = new mongoose.Schema({
	from: String,
	to: String,
	price: Number
})

mongoose.model('Station', stationSchema);
mongoose.model('PriceData', priceSchema);

