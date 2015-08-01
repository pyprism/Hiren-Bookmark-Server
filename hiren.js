/**
 * Created by prism on 8/1/15.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cons = require('consolidate');

var app = express();

app.enable('trust proxy');
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render('index', { 'data': 'hi'}); // load the single view file
});

var port = process.env.PORT || 4000,
    db = mongoose.connect( process.env.DB || 'mongodb://localhost/hiren_bookmark');

app.listen(port, function(){
    console.log('App is running on port: ' + port);
});