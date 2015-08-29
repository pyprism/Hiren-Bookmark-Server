/**
 * Created by prism on 8/23/15.
 */
var express = require('express'),
    moment = require('moment-timezone');


var routes = function(URL, Tag){
    var router = express.Router();

    //test
    router.route('/')
        .get(function(req, res) {
            res.render('pages/add-new', {auth: null});
        });
    /*
      Add new url and tag
    */
    router.route('/add')
        .get(function(req, res) {
            console.log(moment().tz('Asia/Dhaka'));
            console.log(moment().tz('Asia/Dhaka').format());
            res.render('pages/add-new', {auth: null});
        })
        .post(function(req, res) {
            console.log(req.body);
            var url = new URL({title: req.body.title, href: req.body.url});
            url.save();
            console.log(url);
            Tag.findOne({title: req.body.tag}, function(err, hiren) {
               if(hiren)
               console.log(hiren);
                else {
                   var tag = new Tag({title: req.body.tag, ref: url._id});
                   tag.save();
               }
            });
            res.send(":D");
        });

    return router;
};

module.exports = routes;