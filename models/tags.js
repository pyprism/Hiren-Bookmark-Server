/**
 * Created by prism on 8/29/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tag = new Schema({
    name: String,
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'URL'
    },
    createdOn : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tag', tag);