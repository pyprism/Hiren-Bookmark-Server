/**
 * Created by prism on 8/27/15.
 */
var express = require('express'),
    request = require('request'),
    cheerio = require('cheerio');

var routes = function (Tag) {
    var router = express.Router();

    //route for fetching title using AJAX
    router.route('/title')
        .post(function (req, res) {
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

    //route for tag cloud
    router.route('/tags')
        .get(function (req, res) {
/*            Tag.find({}, 'name', function(err, data) {
                if(!err)
                    res.send(data);
            });*/
            Tag.findAsync({}, {name: 1, urlId: 1, _id: 0}).then(function(tags) {
                var result = [];
                tags.forEach(function(tag) {
                    var tempResult = {};
                    tempResult.text = tag.name;
                    tempResult.weight = (tag.urlId).length;
                    tempResult.link = '/dashboard/tags/' + tag.name;
                    result.push(tempResult);
                });
                res.send(result);
            }).catch(function(err) {
                res.status(500).send(err);
            });
        });

    return router;
};

module.exports = routes;