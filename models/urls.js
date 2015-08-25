/**
 * Created by prism on 8/24/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = new Schema({
   title: String,
    href: String
});

var tag = new Schema({
    name: String,
    ref: [url]
});

exports.URL = mongoose.model('URL', url);
exports.Tag = mongoose.model('Tag', tag);