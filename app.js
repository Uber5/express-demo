// DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// MIDDLEWARE
// TODO: Thabang: Find out reason for 'extended: true/false' option.
app.use(bodyParser.json({
	extended: true,	
}));

app.use(bodyParser.urlencoded({
	extended: true,
}));

// ROUTES
app.get('/', function (req, res) {
  res.send('Hello World! I\'m an Express Server!');
});

// TODO: Thabang: Define Profile API.
app.get('/api/profiles/:id', function(req, res){
	// Get single or all UserProfiles.
	// TODO: Thabang: Create query function.
	if (req.params.id == 'all') {
		res.status(201).send("Status: " + res.statusCode + "Here are all the users.");
	} else {
		res.status(201).send("Status: " + res.statusCode + ' User: ' + req.params.id);
	}
});

app.post('/api/profiles', function(req, res){
	// Perfom data clean.
	// Create New Profile and respond accordingly.
	res.status(201).send("Status: " + res.statusCode + " Added new user.");
});

// app.put('api/profiles', function(req, res){
// 	// Update profile using email as identifier.
// });

// app.delete('api/profiles', function(req, res){
// 	// Delete profile using email as identifier.
// });

// TODO: Thabang: Move into seperate json file.
// TODO: LATER: Save to db.
// Dummy Database.
var profiles = []

// SERVER
var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Basic Express app listening at http://%s:%s', host, port);

});