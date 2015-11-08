/**
 * Created by prism on 8/30/15.
 */
var express = require('express');
var async = require('async');

var routes = function(Tag, Urls) {
    var router = express.Router();

    //serve tag page
    router.route('/')
        .get(function (req, res){
            res.render('pages/tags');
        });

    //get specific tag details
    router.route('/:name')
        .get(function (req, res) {
                var values = [];
                 Tag.findOneAsync({'name': req.params.name}, {urlId: 1, _id: 0}).then(function (data) {
                    data['urlId'].forEach(function (urlId) {
                        Urls.findByIdAsync(urlId).then(function (result) {
                            values.push(result);
                        }).catch(function (err) {
                            res.status(500).send(err);
                        });
                    });
                }).catch(function (err) {
                    res.status(500).send(err);
                });

                res.send(values);
	 });

    return router;
};

module.exports = routes;
