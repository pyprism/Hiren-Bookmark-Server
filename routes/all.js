/**
 * Created by prism on 8/31/15.
 */
var express = require('express');
var Promise = require("bluebird");

var routes = function(Tag, Url) {
    var router = express.Router();

    /*
     just serve the page
     */
    router.route('/')
        .get(function (req, res){
            res.render('pages/all');
        });

    //get all url and associate tag
    router.route('/all')
        .get(function (req, res) {
            var values = [];
            var obj = {};
            Url.findAsync().then(function(urls) {
                return Promise.each(urls, function(url) {
                    obj['title'] = url['title'];
                    obj['date'] = url['createdOn'];
                    obj['href'] = url['href'];
                    return Tag.findOneAsync({'urlId': url._id}).then(function (hiren) {
                        obj['tag'] = hiren['name'];
                        values.push(obj);
                    });
                }).then(function () {
                    res.send(values);
                }).caught(function (err) {
                    res.status(500).send(err);
                });
            });
        });

    return router;
};

module.exports = routes;