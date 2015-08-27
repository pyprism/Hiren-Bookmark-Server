/**
 * Created by prism on 8/27/15.
 */
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio');

var routes = function(urls) {
    var router = express.Router();

    //route for fetching title using AJAX
    router.route('/title')
        .post(function(req, res) {
            request(req.body.hiren, function(error, response, html) {
                if(!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    res.send($('title').text());
                }
                else {
                    res.send('Fetching failed');
                }
            });
        });

    //get all tags name
    router.route('/tags')
        .get(function(req, res) {
            urls.Tag.find({}, 'name', function(err, data) {
                if(!err)
                    res.send(data);
            });
        });

    return router;
};

module.exports = routes;