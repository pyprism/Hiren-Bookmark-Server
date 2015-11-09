/**
 * Created by prism on 8/30/15.
 */
var express = require('express');
var Promise = require("bluebird");

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
            Tag.findOneAsync({'name': req.params.name}, {urlId: 1, _id: 0}).then(function (data) {
                return Promise.map(data['urlId'], function (urlId) {
                    return Urls.findByIdAsync(urlId).then(function (result) {
                        return result;
                    });
                });
            })
                .then(function (values) {
                    res.render('pages/single_tag', {'values': values, 'tag': req.params.name});
                    //res.send(values);
                })
               .caught(function (err) {
                    res.status(500).send(err);
               });
        });

    //Delete url and reference from tag
    router.route('/:del/:id')
        .get(function (req, res) {
            if (req.params.del === 'delete') {
                Urls.removeAsync({'_id': req.params.id}).then(function() {
                    Tag.findOneAsync({'name': req.query.tag}).then(function (data) {
                        var index = data.urlId.indexOf(req.params.id);
                        data.urlId.splice(index);
                        data.save();
                    });
                });

            }
            res.redirect('/dashboard/tags/');
        });

    return router;
};

module.exports = routes;
