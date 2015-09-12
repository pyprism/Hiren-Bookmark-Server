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
            res.render('pages/add-new', {auth: null});
        })
        .post(function(req, res) {
            var url = new URL({title: req.body.title, href: req.body.url});
            url.save();
            Tag.findOne({name: req.body.tag}, function(err, hiren) {
               if(hiren) {
                   console.log(url._id);
                  Tag.findByIdAndUpdate({_id: hiren._id}, {$push: {urlId: url._id}}, {safe: true, upsert: true, new: true}, function(err, data) {
                      if(err) {
                          return res.render('error', {message: err.message,  error: err});
                      }
                  });
               }
                else {
                   var tag = new Tag({name: req.body.tag, urlId: url._id});
                   tag.save();
               }
            });
            res.redirect('/dashboard/add');
        });

    return router;
};

module.exports = routes;