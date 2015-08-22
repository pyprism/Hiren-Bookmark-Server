/**
 * Created by prism on 8/2/15.
 */
var express = require('express'),
    passport = require('passport');

var routes = function(Account) {
    var router = express.Router();

    // routes for registration
    router.route('/register')
        .get(function(req, res) {
            res.render('pages/register', { error: null});
        })
        .post(function(req, res) {
            Account.count({}, function( err, count){
                if (count == 1){   //only single account permitted to register
                    return res.render('pages/register', {error: "There is already an account existed!"});
                } else {
                    Account.register(new Account({username: req.body.email}), req.body.password, function(err, account) {
                        if (err) {
                            return res.render('pages/register', { error : err });
                        }

                        passport.authenticate('local')(req, res, function () {
                            res.redirect('/dashboard');
                        });

                    });
                }
            });

        });

    //routes for login
    router.route('/login')
        .get(function(req, res) {
            res.render('pages/login', { error: null});
        })
        .post( passport.authenticate('local'), function(req, res) {
            res.redirect('/dashboard');
        });

    //logout route
    router.route('/logout')
        .get(function(req, res){
           req.logout();
            res.redirect('/');
        });
    return router;
};

module.exports = routes;