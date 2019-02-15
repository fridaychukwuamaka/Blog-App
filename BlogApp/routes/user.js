var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressValidator= require("express-validator");
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('./user/register');
});

// Login
router.get('/login', function (req, res) {
	res.render('./user/login');
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	

	if(password !== password2){
		req.flash("error_msg", "Passwords do not match")
		res.redirect("/register")
	}
	else {
		//checking for email and username are already taken
		User.findOne({username:{ "$regex": "^" + username + "\\b", "$options":"i"} }, function(err, user){
			if(user){
				req.flash("error_msg", "Username has taken already try new")
				res.redirect("/register")
			}
		})
		
			User.findOne({email:{ "$regex": "^" + email + "\\b", "$options":"i"} }, function(err, mail){
					if(mail){
						req.flash("error_msg", "You are already registered")
						res.redirect("/login")
					}else{
						var newUser = new User({
							name: name,
							email: email,
							username: username,
							password: password
						});
						User.createUser(newUser, function (err, user) {
							if (err) {;
							console.log(user);
							}else{
								req.flash('success_msg', 'You are registered and can now login');
						res.redirect('/login');
							}
						});
					}
			})
								}
							}
						
					)
				
			
		

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		req.flash("success_msg",  "Welcome you are logged in")
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');
	res.redirect('/blogs');
});




function isEnabled(req, res, next){
    if(req.isAuthenticated()){
                if( req.user.accType==="admin"){
                    return next();
                }
                else{
                    res.redirect("back")
                }
            }else{
                res.redirect("/blogs")
            }
        }
            
   

   
   function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
}
req.flash("error", "Please Login First!")
    res.redirect("/blogs")
}

function checkProfileOwnership(req, res ,next){
    if(req.isAuthenticated()){
        Blog.find().where("author.id").equals(req.user._id).exec(function(err, blogs){
            return next()
        })
             }else{
                res.redirect("back")
            }
    }



function checkBlogPostOwnership(req, res ,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("back")
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                   return next()
            }else{
                res.redirect("back")
            }
        }
        });
    }else{
        res.redirect("back")
    }
}

function checkAccomPostOwnership(req, res ,next){
    if(req.isAuthenticated()){
       Accomodation.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("back")
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                   return next()
            }else{
                res.redirect("back")
            }
        }
        });
    }else{
        res.redirect("back")
    }
}
module.exports=router;