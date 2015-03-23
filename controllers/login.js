/**
 * Created by prism on 3/23/15.
 */
var User = require('../model/accounts');
var jwt = require('jsonwebtoken');

function login(res, req) {
    var username = req.body.username || '',
        password = req.body.password || '' ;

    if(username == '' || password == ''){
        return res.send(401);
    }

    User.findOne({ username: username}, function(err, user){
        if(err){
            console.log(err);
            return res.send(401);
        }

        user.comparePassword(password, function(isMatch){
            if(!isMatch){
                console.log('Attempt failed to login with ' + user.user);
                return res.send(401);
            }

            var token = jwt.sign(user, secret.secretToken, {expireInMinutes: 60});
            return res.json({token:token});
        });
    });
}

module.exports = login;