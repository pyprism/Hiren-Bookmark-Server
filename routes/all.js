/**
 * Created by prism on 8/31/15.
 */
var express = require('express'),
    async = require('async');

var routes = function(Tag, URL) {
    var router = express.Router();

    /*
     List all tags
     */
    router.route('/')
        .get(function(req, res){
           var pageNo = undefined === req.params.pageNo ? 1 : req.params.pageNo;
            //----------------------
            URL.paginate({}, {
                page: pageNo, limit: 10
                //page: req.params.pageNo, limit: 10
            }, function (err, result) {
               // console.log(result);
                var data = [];
                data.row = [];
                data.total = result.length;
                result.forEach(function (element) {
                    async.waterfall([
                       function (callback) {
                           console.log(element._id);
                            Tag.findOne({ref: element._id}, function (err, result) {
                                //console.log(result)
                                data.row.push({'title': element.title, 'tag': result.name});
                            });
                            callback(null, data);
                    }
                    ], function (err, result) {
                        if(!err)
                            console.log(result);
                    });
                });

                /*result.forEach(function(element, index, array) {
                    Tag.findOne({ref: element._id}, function(err, result) {
                      console.log(result.name);
                        data.row.push({'title': element.title, 'tag': result.name});
                        console.log(data);
                    });
                });*/

                //console.log(result.length);
            });
            res.render('pages/all');
        });


    return router;
};

module.exports = routes;