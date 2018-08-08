var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});


// Get Homepage
router.get('/account', ensureAuthenticated, function(req, res){
	// Get User Info
	User.findById(req.user.id, function (err, content) {
		res.render('account', { title: 'Account Management', contents: content });
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
