// DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');

// MIDDLEWARE
// TODO: Thabang: Find out purpose for 'extended: true/false' option.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true,
}));


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
	var now = new Date().toJSON();
	lastID++;

	value.date_joined = now;
	value.id = lastID;
	profiles.push(value);
});


// VIEWS
app.get('/', function (req, res) {
  res.render('pages/index', {title: "Hi there, I'm an Express Server! Enter your details below."});
});


// PROFILES API
// Find Profile from dummy DB with ID. Returns profile or null.
// TODO: OPTIONAL: Thabang: Find better exhaustive search method.
function findProfileByID(id){
	var response = null;
	profiles.forEach(function(profile){
		if (profile.id == id) {
			response = profile;
		}
	});
	return response;
}

function findProfileByEmail(email){
	var response = null;
	profiles.forEach(function(profile){
		if (profile.email == email) {
			response = profile;
		}
	});
	return response;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateFirstLastName(first, last){
	if (first.length>0 && last.length>0){
		return true;
	} else {
		return false;
	};
};

// Profiles GET ALL
app.get('/api/profiles', function(req, res){
	res.status(200).send(profiles);
});
// Profiles GET by ID
app.get('/api/profiles/:id', function(req, res){
	var response = findProfileByID(req.params.id);
	
	if ( response == null ){
			res.status(404).send("Profile Was not Found!");
		} else {
			res.status(200).send(response);
		};
});
// Profiles POST
app.post('/api/profiles', function(req, res){
	var profile = req.body;
	var namesValid = validateFirstLastName(profile.first_name, profile.last_name);
	var emailvalid = validateEmail(profile.email);

	if (emailvalid && emailvalid) {
		var response = findProfileByEmail(profile.email);
		
		if (response == null) {
			var now = new Date().toJSON();
			lastID++;
			profile.id = lastID;
			profiles.push(profile);
			res.status(201).send("Status: " + res.statusCode + ", Added new user with id " + profile.id);
		} else {
			res.status(200);
			res.send("Status: " +res.statusCode+ ", Profile with email: " + profile.email + " already exists!");
		};	
	} else {
		res.status(200).send("Status: " + res.statusCode + ", Please Enter a valid Email address.")
	};
});
// Profiles PUT
app.put('/api/profiles', function(req, res){
	var profile_update = req.body;
	var profile = findProfileByEmail(profile_update.email);
	var namesValid = validateFirstLastName(profile_update.first_name, profile_update.last_name)

	if (profile && namesValid){
		for (i = 0; i <= profiles.length; i++){
			if (profiles[i].id == profile.id){
				profile_update.id = profile.id;
				profiles[i] = profile_update;
				res.status(201).send("Status: "+res.statusCode+ ", Updated profile with ID: "+profile.id);
			};
		};
	} else {
		res.status(200).send("Status: "+res.statusCode+", Could not update profile!");
	};
});
// Profiles DELETE
app.delete('/api/profiles/:id', function(req, res){
	var id = req.params.id;
	var profile = findProfileByID(id);
	if (profile == null){
		res.status(404).send("Status: " +res.statusCode+ ", Profile does not exist!");
	} else {
		for (i = 0; i <= profiles.length; i++){
			if (profiles[i].id == id){
				profiles.splice(i, 1);
				res.status(201).send("Status: "+res.statusCode+ ", Deleted profile with ID: "+id);
			};
		};
	};
});


// SERVER
var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Basic Express app listening at http://%s:%s', host, port);

});