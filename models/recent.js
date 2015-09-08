/**
 * Created by prism on 8/31/15.
 */
var mongoose = require('mongoose'),
    moment = require('moment-timezone');
var Schema = mongoose.Schema;

var recent = new Schema({
    refId: Array,
    createdOn : {
        type: Date,
        default: moment().tz('Asia/Dhaka')
    }
});

module.exports = mongoose.model('Recent', recent);