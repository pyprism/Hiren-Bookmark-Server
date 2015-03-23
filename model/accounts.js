/**
 * Created by prism on 3/23/15.
 */
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    username: { type: String, required: true, unique:true },
    password: { type: String, required: true},
    created: { type: Date, default: Date.now }
});

// Bcrypt middleware on UserSchema o.O
User.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
User.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, function(err, hash){
        if(err) return cb(err);
        cb(isMatch);
    })
};

//User model
module.exports = mongoose.model('User', User);