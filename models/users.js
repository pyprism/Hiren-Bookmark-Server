/**
 * Created by prism on 8/2/15.
 */
var Promise = require("bluebird"),
    mongoose = Promise.promisifyAll(require("mongoose"));
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var user = new Schema({
    username: String,
    password: String
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', user);
