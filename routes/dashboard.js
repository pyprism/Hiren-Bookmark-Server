/**
 * Created by prism on 8/23/15.
 */
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio');

var routes = function(){
    var router = express.Router();

    //test
    router.route('/')
        .get(function(req, res) {
            res.render('pages/add-new', {auth: null});
        });

    router.route('/add')
        .get(function(req, res) {
            res.render('pages/add-new', {auth: null});
        })
        .post(function(req, res) {
            console.log(req.body);
            request(req.body.url, function(error, response, html) {
                if(!error && response.statusCode == 200){
                    var $ = cheerio.load(html);
                    console.log($('title').text());
                    res.send('nisha');
                }
            });

        });

    router.route('/ajax')
        .post(function(req, res) {
            var obj = {};
            console.log('body: ' + JSON.stringify(req.body));
            console.log(req.body.hiren);
            res.send(req.body);
        });

    return router;
};

module.exports = routes;