var express                 = require('express'),
    session                 =require('express-session'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    LocalStrategy           = require('passport-local'),
    User                    = require('./models/user'),
    passportLocalMongoose   = require('passport-local-mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth_demo_app', {useMongoClient: true});
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'nahbruh',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES ===========================================================================

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/secret',  isLoggedIn, function(req, res) {
    res.render('secret');
});

// register routes
app.get('/register', function(req, res) {
    res.render('register'); 
});
app.post('/register', function(req, res) {
    req.body.username
    req.body.password
    User.register(new User( {username: req.body.username} ), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.render('secret');
        });
    });
});

// login routes
app.get('/login', function(req, res) {
    res.render('login');
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect('/login');
}

//start server
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log('server started...');
})