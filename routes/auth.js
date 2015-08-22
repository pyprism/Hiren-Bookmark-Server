/**
 * Created by prism on 8/2/15.
 */
var express = require('express'),
    passport = require('passport');

var routes = function(Account) {
    var router = express.Router();

    router.route('/register')
        .get(function(req, res) {
            res.render('pages/register', { error: null});
        })
        .post(function(req, res) {
            Account.count({}, function( err, count){
                if (count == 1){
                    return res.render('pages/register', {error: "There is already an account existed!"});
                } else {
                    Account.register(new Account({username: req.body.email}), req.body.password, function(err, account) {
                        if (err) {
                            return res.render('pages/register', { error : err });
                        }

                        passport.authenticate('local')(req, res, function () {
                            res.redirect('/');
                        });

                    });
                }
            });

        });
    return router;
};

module.exports = routes;