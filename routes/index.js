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



router.get('/education/', ensureAuthenticated, function(req, res){
  var pathway;
    User.findById(req.user.id, 'pathway', function(err, users) {
      pathway = users.pathway;
      var collection = db.collection(pathway);
      collection.find({}).toArray(function(err, modules){
        res.render('education', {title: 'Modules', contents: modules[0].modules});
      })
    });
  });

router.get('/robotics_Module/', ensureAuthenticated, function(req, res){
      var collection = db.collection('roboticVision_Pathway');
      collection.find('modules').toArray(function(err, modules){
        console.log(modules[0].modules[0]);
        res.render('module', {title: 'Modules', contents: modules[0].modules[0]});
      })
    });

router.get('/machineLearning_Module/', ensureAuthenticated, function(req, res){
  var collection = db.collection('roboticVision_Pathway');
      collection.find('modules').toArray(function(err, modules){
        console.log(modules[0].modules[1]);
        res.render('module', {title: 'Modules', contents: modules[0].modules[1]});
      })
  });


router.get('/education/CourseMaterial', function(req, res){

 
    // Get the documents collection
    var collection = db.collection('courseMaterial');
 var testVariable;
    // Find all students
    collection.find({}).toArray(function (err, result) {
    	testVariable = result[0].material;
      if (err) {
        res.send(err);
      } else if (testVariable.length) {
      	
      	
        res.render('CourseMaterial',{
 
          // Pass the returned database documents to handlebar
          "content" : testVariable
        });
        console.log(testVariable);
      } else {
        res.send('No documents found');
      }
      //Close connection
      
    });
  
});


//post update
router.post('/account', (req, res, next) => {
    	//update the fields in the database for logged in user
        db.collection("users").updateOne({"_id": req.user._id}, {$set:{'email': req.body.email, 'zip': req.body.zip}}, (err, result) => {
          if(err) {
            throw err;
          }
	//reload account management page (had issues with loading the db values again, probably because this is a post call, not a get)
          res.redirect('back');
          console.log('account info updated sucessfully');
        });
    });


//router.post('/account', function(req, res) {
//    	//update the fields in the database for logged in user
//        db.User.findByIdAndUpdate(req.params.id, {$set:{email: req.body.email, zip: req.body.zip}}, function(err, result) {
//          if(err) {
//            throw err;
//          }
//	//reload account management page (had issues with loading the db values again, probably because this is a post call, not a get)
//          res.render('/account');
//          console.log('account info updated sucessfully');
//        });
//    });


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
