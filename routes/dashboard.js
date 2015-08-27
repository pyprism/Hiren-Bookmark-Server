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

    return router;
};

module.exports = routes;