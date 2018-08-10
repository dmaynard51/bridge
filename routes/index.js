var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var mongoose = require('mongoose');
var db = mongoose.connection;

// Get Homepage
//router.get('/', ensureAuthenticated, function(req, res){		
//	res.render('index');
//	console.log("test2");
//
//});


//load data to dashboard
router.get('/', ensureAuthenticated, function(req, res){
	// Get User Info
	User.findById(req.user.id, function (err, content) {
		res.render('index', { title: 'Dashboard', contents: content });
	});
});


// Get Account Management Page
router.get('/account', ensureAuthenticated, function(req, res){
	// Get User Info
	User.findById(req.user.id, function (err, content) {
		res.render('account', { title: 'Account Management', contents: content });
	});
});

//post update
router.post('/account', function(req, res) {
    	//update the fields in the database for logged in user
        db.collection('User').update(_id: req.user.id, {$set:{email: req.body.email, zip: req.body.zip}}, function(err, result) {
          if(err) {
            throw err;
          }
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
