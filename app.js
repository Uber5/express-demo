// Dependencies.
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World! I\'m an Express Server!');
});

// TODO: Thabang: Define Profile API.
app.get('/api/profiles/', function(req, res){
	// Get all UserProfiles.
	res.send('Some users here!');
});

app.post('/api/profiles/', function(req, res){
	// Create New Profile.
	// Perfom data clean.
	console.log(req);
	res.send('Created some users here! NOT!');
});

// app.put('api/profiles/', function(req, res){
// 	// Update profile using email as identifier.
// });

// app.delete('api/profiles/', function(req, res){
// 	// Delete profile using email as identifier.
// });

// TODO: Thabang: Move into seperate json file.
// TODO: LATER: Save to db.
// Dummy Database.
var profiles = []

// Server Definition.
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Basic Express app listening at http://%s:%s', host, port);

});