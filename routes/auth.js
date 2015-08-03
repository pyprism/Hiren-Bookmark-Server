/**
 * Created by prism on 8/2/15.
 */
var express = require('express'),
    passport = require('passport');

var routes = function(Account) {
    var router = express.Router();

    router.route('/register')
        .get(function(req, res) {
            res.render('register');
        })
        .post(function(req, res) {
            Account.register(new Account({username: req.body.username}), req.body.password, function(err, account) {
                if (err) {
                    return res.render('register', { account : account });
                }

                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                });

            });
        });
};

module.exports = routes;