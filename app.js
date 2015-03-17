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

fixtures.forEach(function(profile){
	lastID++;

	profile.date_joined = new Date();
	profile.id = lastID;
	profiles.push(profile);
});


// VIEWS
app.get('/', function (req, res) {
  res.render('pages/index', {title: "Hi there, I'm an Express Server! Enter your details below."});
});

var validators = {
  email: function(value) {
    return validateEmail(value);
  },
  first_name: function(value) {
    return value && value.length;
  },
  last_name: function(value) {
    return value && value.length;
  }
}

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
	if (first && first.length > 0 && last && last.length > 0){
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
	var body = req.body;
	var namesValid = validateFirstLastName(body.first_name, body.last_name);
	var emailValid = validateEmail(body.email);

	if (emailValid && namesValid) {
		var existingProfile = findProfileByEmail(body.email);
		
		if (existingProfile == null) {
			lastID++;
      var profile = {
        id: lastID,
        date_joined: new Date(),
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name
      };
			profiles.push(profile);
			res.status(201).send("Status: " + res.statusCode + ", Added new user with id " + profile.id);
		} else {
			res.status(400);
			res.send("Status: " + res.statusCode + ", Profile with email: " + body.email + " already exists.");
		};	
	} else {
		res.status(400).send("input validation failed");
	};
});

function determinePutProperties(body) {

  var updateableProperties = [
    'first_name', 'last_name', 'email'
  ];

  var providedProperties = [];
  for (var property in body) {
    if (updateableProperties.indexOf(property) > -1) {
      providedProperties.push(property);
    }
  }

  return providedProperties;
}

app.put('/api/profiles/:id', function(req, res){
	var profileUpdate = req.body;
	var profile = findProfileByID(req.params.id);

  var providedProperties = determinePutProperties(profileUpdate);

	if (profile) {
    var areAllUpdatesValid = true;
    providedProperties.forEach(function(property) {
      var validator = validators[property];
      var isValid = validator(profileUpdate[property]);
      if (!isValid) {
        areAllUpdatesValid = false;
      }
    });
    if (areAllUpdatesValid) {
      providedProperties.forEach(function(property) {
        profile[property] = profileUpdate[property];
      });
      res.status(200).send("Status: "+res.statusCode+ ", Updated profile with ID: "+profile.id);
    } else {
      res.status(400).send('Invalid update(s)');
    }
	} else {
		res.status(404).send("Profile not found");
	};
});

// Profiles DELETE
app.delete('/api/profiles/:id', function(req, res){
	var id = req.params.id;
  for (i = 0; i < profiles.length; i++) {
    if (profiles[i].id == id){
      profiles.splice(i, 1);
      return res.status(200).send("Status: "+res.statusCode+ ", Deleted profile with ID: "+id);
    };
  };
  res.status(404).send("Status: " +res.statusCode+ ", Profile does not exist!");
});


// SERVER
var server = app.listen(8000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Basic Express app listening at http://%s:%s', host, port);

});
