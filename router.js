var http = require('http');
var port = process.env.PORT || 3000;
var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end("Woohoo!");
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});