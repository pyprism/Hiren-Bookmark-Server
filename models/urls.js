/**
 * Created by prism on 8/24/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = new Schema({
   title: String,
    href: String
});

module.exports = mongoose.model('URL', url);