/**
 * Created by prism on 8/24/15.
 */
var Promise = require("bluebird"),
    mongoose = Promise.promisifyAll(require("mongoose")),
    moment = require('moment-timezone'),
    mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var url = new Schema({
   title: String,
    href: String,
    createdOn : {
        type:Date,
        default: moment().tz('Asia/Dhaka')
    }
});

url.plugin(mongoosePaginate);
module.exports = mongoose.model('URL', url);