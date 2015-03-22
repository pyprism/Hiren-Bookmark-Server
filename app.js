/**
 * Created by prism on 3/22/15.
 */

var express = require('express'),
    app = express();

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile('index.html');
});


var server = app.listen(3000, function () {
    var host = server.address().address,
        port = server.address().port;
    console.log("Hiren-Bookmark app listening at http://%s:%s", host, port );
});