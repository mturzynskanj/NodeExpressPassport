/**
 * Created by mariaturzynska on 1/13/16.
 */
var JwtStrategy = require('passport-jwt').Strategy;


//loading the user model

var User = require('../app/models/user');
var config = require('../config/database');


module.exports = function(passport){
	var opts={};

	opts.secretOrKey = config.secret;

	passport.use(new JwtStrategy(opts,function(jwt_payload,done){
		User.findOne({}, function(err, user){
			if(err){
				return done(err, false);
			}

			if(user){
				done(null, user)
			} else{
				done(null, false);
			}
		});
	}));
};