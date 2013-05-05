var http = require('http');
var path = require("path");
var fs  = require('fs');
var url  = require('url');
var port = process.env.PORT || 3000;

var mimeTypes = {
    '.js' : 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};
var cache = {};
function cacheAndDeliver(f, cb){
    if(!cache[f]) {
        fs.readFile(f, function(err, data){
            if(!err) {
                cache[f] = {content:data};
            }
            cb(err, data);
        });
        return;
    }
    console.log("Loading " + f + " from cache");
    cb(null, cache[f].content);
}
var pages = [
    {id: '1', route: '', output: 'Woohoo!'},
    {id: '2', route: 'about', output: "A simple routing with Node example"},
    {id: '3', route: 'another page', output: function(){return 'Here\'s ' + this.route;}}
];
var server = http.createServer(function(request, response){
    if(request.url === '/favicon.ico'){ 
        response.writeHead(404);
        return response.end();
    }
    // var id = url.parse(decodeURI(request.url), true).query.id;
    var lookup = path.basename(decodeURI(request.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function(exists){
        if(exists){
            cacheAndDeliver(f, function(err, data){
                if(err){
                    response.writeHead(500);
                    response.end('Sever error');
                    return;
                } 
                var headers = {'Content-type': mimeTypes[path.extname(lookup)]};
                response.writeHead(200, headers);
                response.end(data);
                return;           
            });
        } else {
            response.writeHead(404); // no file found;
            response.end();
        }
    });
    /*
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
    */
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});