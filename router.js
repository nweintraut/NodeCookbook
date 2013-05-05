var http = require('http');
var path = require("path");
var port = process.env.PORT || 3000;

var pages = [
    {route: '/', output: 'Woohoo!'},
//    {route: 'about', output: 'A simple routing with Node example'},
    {route: '/about/this', output: "Multilevel routing with Node"},
    {route: "/about/node", output: "Evented I/O for V8 Javascript"},
    {route: '/another page', output: function(){return 'Here\'s ' + this.route;}}
];
var server = http.createServer(function(request, response){
    var lookup = decodeURI(request.url);
    console.log("Lookup is: " + lookup + "]");
//    var lookup = path.basename(decodeURI(request.url));
    pages.forEach(function(page){
        if(page.route === lookup) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(typeof page.output === 'function' ? page.output(): page.output);
        }
    });
    if(!response.finished){
        response.writeHead(404);
        response.end("Page Not Found");
    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});