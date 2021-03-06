/**
 * Created by mariaturzynska on 1/13/16.
 */
var express     =     require('express');
var app         =     express();
var bodyParser  =     require('body-parser');

var morgan      =      require('morgan');
var passport = require('passport');
var config  = require('./config/database');
var User    = require('./app/models/user'); // mongoose model

var mongoose = require('mongoose');

var port = process.env.PORT  || 8080;

//  jwt - json web token  - encode and decode modules

var jwt  = require('jwt-simple');


// getting requrest parameters
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// logging to console

app.use(morgan('dev'));

//use passport package in our application

app.use(passport.initialize());


//demo Route


mongoose.connect(config.database);

require('./config/passport')(passport);

var apiRoutes= express.Router();

//create new user

apiRoutes.get('/',function(req, res){
	  res.send('inside get ');
});

apiRoutes.post('/signup',function(req,res){
	if(!req.body.name || !req.body.password){
		res.json({success: false, msg:"Please pass name and passowrd"})
	}else{

		var newUser = new User({
			name: req.body.name,
			password:req.body.password
		});
		newUser.save(function(err){
			if(err){
				return res.json({success:false, msg:'user alerty exidts'})
			}
			res.json({success:true, msg:"Successful created new user"})

		});
	};

});

apiRoutes.post('/authenticate',function(req,res){
	User.findOne({
		name:req.body.name
	},function(err, user){
		if(err)throw err;

		if(!user){
			res.send({success: false, msg:"Authentication failed , there is no valid user"})
		}else{
			user.comparePassword(req.body.password,function(err, isMatch){
				if(isMatch && !err){
					var token = jwt.encode(user, config.secret);
					res.json({success:true, token: 'JWT '+ token});

				}else{
					res.send({success: false, msg:"Authentication failed .Wrong Password"});
				}
			});
		}

	});

});

//restricted info   localhost:8080/api/memeberinfo
apiRoutes.get('/memberInfo', passport.authenticate('jwt',{ session:false}),function(req,res){
	var token =getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			name:decoded.name
		},function(err, user){
              if(err ) throw err;

			if(!user){
				return res.status(403 ).send({success: false,msg:"Authenigcation failed "})
			}else{
				res.json({success: true, msg:"Welcome in the memeber area " + user.name +'!'})
			}

		});
	}else{
		return res.status(403 ).send({success: false, msg:'Not token provided'})
	}
});

getToken = function (headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

app.use('/api', apiRoutes);

app.listen(port);

console.log('server is running .... ');