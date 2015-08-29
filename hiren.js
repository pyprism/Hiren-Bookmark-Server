/**
 * Created by prism on 8/1/15.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Account = require('./models/users'),
    urls = require('./models/urls'),
    tags = require('./models/tags'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    helmet = require('helmet'),
    morgan = require('morgan'),
    cors = require('cors'),
    compression = require('compression');

var app = express();

//route import , model  injection
var auth = require('./routes/auth')(Account);
var dashboard = require('./routes/dashboard')(urls, tags);
var ajax = require('./routes/ajax')(tags);


app.enable('trust proxy');
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    store: new RedisStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//logger
if (app.get('env') == 'production') {
    app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + 'morgan.log' }));
} else {
    app.use(morgan('dev'));
}


// passport config
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//check authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

app.use('/auth', auth);
app.use('/dashboard', ensureAuthenticated, dashboard);
app.use('/ajax', ensureAuthenticated, ajax);

app.get('/', function(req, res) {
   // if (req.isAuthenticated()) {
   //     var auth = true;
   //     console.error(req.isAuthenticated());
   // }
    res.render('pages/index', {auth: req.isAuthenticated() ? true: false});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




var port = process.env.PORT || 4000,
    db = mongoose.connect( process.env.DB || 'mongodb://localhost/hiren_bookmark');



app.listen(port, function(){
    console.log('App is running on port: ' + port);
});
