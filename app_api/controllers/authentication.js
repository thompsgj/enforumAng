var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function(req, res) {
	var user = new User();

	user.name = req.body.name;
	user.email = req.body.email;
	user.role = req.body.role;
	user.studentid = req.body.studentid;

	user.setPassword(req.body.password);

	user.save(function(err) {
		var token;
		token = user.generateJwt();
		res.status(200);
		res.json({
			"token" : token
		});
	});
};

module.exports.updateSelf = function(req, res) {
	var user = new User()

	user._id = req.body.id
	user.name = req.body.name
	user.email = req.body.email
	user.role = req.body.role
	user.studentid = req.body.studentid
	user.setPassword(req.body.password)

	var query;

	if (req.body.password == '') {
		query = {
			"name": user.name,
			"email": user.email,
			"role": user.role,
			"studentid": user.studentid			
		}
	} else {
		query = {
			"name": user.name,
			"email": user.email,
			"salt": user.salt,
			"hash": user.hash,
			"role": user.role,
			"studentid": user.studentid				
		}
	}

	User.update(
		{"_id": req.body.id},
		{$set: query }, function(error) {
			console.log("UPDATE USER ERROR", error)

			res.status(200);
			res.json({
				"userData" : user
		});
	});
}


module.exports.updateUser = function(req, res) {
	var user = new User()

	user._id = req.body.id
	user.name = req.body.name
	user.email = req.body.email
	user.role = req.body.role
	user.studentid = req.body.studentid
	user.setPassword(req.body.password)

	var query;

	if (req.body.password == '') {
		query = {
			"name": user.name,
			"email": user.email,
			"role": user.role,
			"studentid": user.studentid			
		}
	} else {
		query = {
			"name": user.name,
			"email": user.email,
			"salt": user.salt,
			"hash": user.hash,
			"role": user.role,
			"studentid": user.studentid				
		}
	}

	User.update(
		{"_id": req.body.id},
		{$set: query}, function(error) {
			console.log("UPDATE USER ERROR", error)

			res.status(200);
			res.json({
				"userData" : user
		});
	});



}


module.exports.login = function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		var token;

		if(err) {
			res.status(404).json(err);
			return;
		}

		if(user) {
			token = user.generateJwt();
			res.status(200);
			res.json({
				"token" : token
			});
		} else {
			res.status(401).json(info)
		}
	})(req, res);
};