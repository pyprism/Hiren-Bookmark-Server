/**
 * Created by prism on 8/29/15.
 */
var mongoose = require('mongoose'),
    moment = require('moment-timezone');
var Schema = mongoose.Schema;

var tag = new Schema({
    name: String,
    ref: Array,
    createdOn : {
        type: Date,
        default: moment().tz('Asia/Dhaka')
    }
});

module.exports = mongoose.model('Tag', tag);