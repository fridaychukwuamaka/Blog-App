@@ -1,122 +0,0 @@
var express = require("express"),
path = require('path'),
mongoose= require("mongoose"),
flash= require("connect-flash"),
bodyParser=require("body-parser"),
methodOverride= require("method-override"),
expressSanitizer= require("express-sanitizer"),
expressValidator= require("express-validator"),
expressMessage= require("express-messages")
passport=require("passport"),
bcrypt = require("bcryptjs"),
session = require('express-session'),
bodyParser=require("body-parser"),
User= require("./models/user"),
Blog= require("./models/blogs"),
Comment= require("./models/comment"),
Book= require("./models/book"),
AccomComment= require("./models/accomComment"),
Accomodation= require("./models/accomodation"),
LocalStrategy=require("passport-local").Strategy,
passportLocalMongoose=require("passport-local-mongoose");


 //seedDB();
 mongoose.connect("mongodb://localhost/restfult_blog_app")
var db = mongoose.connection;
var accomodationRoutes= require("./routes/accomodation"),
blogRoutes = require("./routes/blog"),
indexRoutes = require("./routes/index"),
userRoutes= require("./routes/user"),
marketRoutes= require("./routes/market"),
bookRoutes = require("./routes/book");

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
 app.set("view engine", "ejs");
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(expressSanitizer());
 app.use(methodOverride("_method"));
 app.use(flash());

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* app.use(cookieParser()); */

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success = req.flash('success_msg');
  res.locals.err = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user || null;
  next();
});



app.use(marketRoutes);
app.use(indexRoutes);
app.use(blogRoutes);
app.use(accomodationRoutes);
app.use(bookRoutes);
app.use(userRoutes);

// Set Port
app.set('port', (process.env.PORT || 9000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});


function checkProfileOwnership(req, res ,next){
    if(req.isAuthenticated()){
        Blog.find().where("author.id").equals(req.user._id).exec(function(err, blogs){
            return next()
        })
             }else{
                res.redirect("back")
            }
    }

