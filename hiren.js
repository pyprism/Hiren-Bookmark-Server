/**
 * Created by prism on 8/1/15.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Account = require('./models/users'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    hbs = require('hbs'),
    helmet = require('helmet'),
    exphbs  = require('express-handlebars'),
    cons = require('consolidate');

//route import and model injection
auth = require('./routes/auth')(Account);

var app = express();

app.enable('trust proxy');
app.use(helmet());
app.use(express.static('public'));
//app.set('view engine', 'hbs');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    store: new RedisStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//handlebar partials support
//hbs.registerPartials(__dirname + '/views/');

// passport config
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/api/income', auth);

app.get('/', function(req, res) {
    res.render('home');
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