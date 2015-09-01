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
           var pageNo = undefined == req.params.pageNo ? 1 : req.params.pageNo;
            console.log(req.params.pageNo);
            //console.log(req.params.pageNo);
            URL.paginate({}, {
                page: pageNo, limit: 10
            }, function(err, result) {
                console.log(result);
            });
            res.render('pages/all');
        });

    return router;
};

module.exports = routes;