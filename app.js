// DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');

// MIDDLEWARE
// TODO: Thabang: Find out reason for 'extended: true/false' option.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true,
}));

// VIEWS
app.get('/', function (req, res) {
  res.render('pages/index', {title: "Hi there, I'm an Express Server! Enter your details below."});
});

// APIS
app.get('/api/profiles', function(req, res){
	res.status(200).send(profiles);
});

app.get('/api/profiles/:id', function(req, res){
	profiles.forEach(function(profile){
		if (profile.id == req.params.id) {
			res.status(200).send(profile);
		} else {
			res.status(404).send("Profile Was not Found!");
		};
	});
});

app.post('/api/profiles', function(req, res){
	var profile = req.body;

	if (foundProfile() == true) {
		res.status(200);
		res.send("Status: " +res.statusCode+ " Profile with email: " + profile.email + " already exists!");
	} else {
		lastID++;
		profile.id = lastID;
		profiles.push(profile);	
		res.status(201).send("Status: " + res.statusCode + " Added new user with id " + profile.id);
	};

	function foundProfile() {
		var found = null;
		profiles.forEach(function(value){
			if (profile.email == value.email){
				found = true;
			} else {
				found = null;
			}
		});
		return found;
	};
});

// app.put('api/profiles', function(req, res){
// 	// Update profile using email as identifier.
// });

// app.delete('api/profiles', function(req, res){
// 	// Delete profile using email as identifier.
// });

// Dummy Database.
var profiles = [];
var lastID = 0;

var fixtures = [
	{
		"first_name": "Thabang",
		"last_name": "Tseboho",
		"email": "thabang@thabang.io"
	},
	{
		"first_name": "Dude",
		"last_name": "Guy",
		"email": "dude@guy.io"
	}
];

fixtures.forEach(function(value){
	lastID++;
	value.id = lastID;
	profiles.push(value);
});

// SERVER

var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Basic Express app listening at http://%s:%s', host, port);

});