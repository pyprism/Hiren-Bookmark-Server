/**
 * Created by prism on 8/30/15.
 */
var express = require('express');

var routes = function(Tag) {
    var router = express.Router();

    /*
    List all tags
     */
    router.route('/')
        .get(function(req, res){

        });

    return router;
};

module.exports = routes;