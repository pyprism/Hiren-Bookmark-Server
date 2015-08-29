/**
 * Created by prism on 8/24/15.
 */
var mongoose = require('mongoose'),
    moment = require('moment-timezone');
var Schema = mongoose.Schema;

var url = new Schema({
   title: String,
    href: String,
    createdOn : {
        type:Date,
        default: moment().tz('Asia/Dhaka')
    }
});

module.exports = mongoose.model('URL', url);