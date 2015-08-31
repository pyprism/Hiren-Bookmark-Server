/**
 * Created by prism on 8/31/15.
 */
var express = require('express');

var routes = function(Tag, URL) {
    var router = express.Router();

    /*
     List all tags
     */
    router.route('/')
        .get(function(req, res){
            res.render('pages/all');
        });

    return router;
};

module.exports = routes;