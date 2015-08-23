/**
 * Created by prism on 8/23/15.
 */
var express = require('express');

var routes = function(){
    var router = express.Router();

    //test
    router.route('/')
        .get(function(req, res) {
            res.render('pages/add-new', {auth: null});
        });

    return router;
};

module.exports = routes;