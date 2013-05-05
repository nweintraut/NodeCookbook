var http = require('http');
var path = require("path");
var url  = require('url');
var port = process.env.PORT || 3000;

var pages = [
    {id: '1', route: '', output: 'Woohoo!'},
    {id: '2', route: 'about', output: "A simple routing with Node example"},
    {id: '3', route: 'another page', output: function(){return 'Here\'s ' + this.route;}}
];
var server = http.createServer(function(request, response){
    var id = url.parse(decodeURI(request.url), true).query.id;
    console.log("Id is: " + id);
    if(id) {
        pages.forEach(function(page){
            if(page.id === id) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(typeof page.output === 'function' ? page.output(): page.output);
            }
        });
    }
    if(!response.finished){
        response.writeHead(404);
        response.end("Page Not Found");
    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});