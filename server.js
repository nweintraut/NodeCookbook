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
    fs.stat(f, function(err, stats){
        if(err){ return cb(err, null);}
        var lastChanged = Date.parse(stats.ctime);
        var isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
        if (!cache[f] || isUpdated) {
            console.log("Reading file: "+ f);
            fs.readFile(f, function(err, data){
            if(!err) {
                cache[f] = {content:data, timestamp: Date.now()};
            }
            cb(err, data);
            });
           return
        }
            console.log("Loading " + f + " from cache");
            cb(null, cache[f].content);
            return;         
    });
}
var pages = [
    {id: '1', route: '', output: 'Woohoo!'},
    {id: '2', route: 'about', output: "A simple routing with Node example"},
    {id: '3', route: 'another page', output: function(){return 'Here\'s ' + this.route;}}
];

var cache2 = {
    store: {},
    maxSize: 26214400, // (bytes) 25 mb
    maxAge: 5400 * 1000, // (ms) 1 and a half hours
    cleanAfter: 7200 * 1000, // (ms) 2 hours
    cleanedAt: 0, // to be set dynamically
    clean: function(now){
        if (now - this.cleanAfter > this.cleanedAt) {
            var that = this;
            Object.keys(this.store).forEach(function(file){
                if (now > that.store[file].timestamp + that.maxAge) {
                    delete that.store[file];
                }
            });
        }
    }
};
function limitedCache(f, callback){
    fs.stat(f, function(err, stats){
        if(stats.size < cache2.maxSize) {
            var bufferOffset = 0;
            cache2.store[f] = {content: new Buffer(stats.size), timestamp: Date.now()};
            s.on('data', function(data){
               data.copy(cache2.store[f].content, bufferOffset);
               bufferOffset += data.length;
            });
        }
    });
}
var server = http.createServer(function(request, response){
    if(request.url === '/favicon.ico'){ 
        response.writeHead(404);
        return response.end();
    }
    var lookup = path.basename(decodeURI(request.url)) || 'index.html';
    var f = 'content/' + lookup;
    fs.exists(f, function(exists){
        if(exists){
            var headers = {'Content-type': mimeTypes[path.extname(f)]};
            if(cache2.store[f]){
                console.log("Reading " + f + " from cache");
                response.writeHead(200, headers);
                response.end(cache2.store[f].content);
                return;
            } else {
                var s = fs.createReadStream(f).once('open', function(){
                    response.writeHead(200, headers);
                    this.pipe(response);
                }).once('error', function(e){
                    console.log(e);
                    response.writeHead(500);
                    response.end('Sever Error.');
                    return;
                });
                fs.stat(f, function(err, stats){
                    if(!err) {
                        var bufferOffset = 0;
                        cache2.store[f] = {content: new Buffer(stats.size), timestamp: Date.now()};
                        s.on('data', function(data){
                           data.copy(cache2.store[f].content, bufferOffset);
                           bufferOffset += data.length;
                        });                        
                        /*
                        cache[f] = {content: new Buffer(stats.size)};
                        s.on('data', function(chunk){
                           chunk.copy(cache[f].content, bufferOffset);
                           bufferOffset += chunk.length;
                        });
                        */
                    }
                });
            }
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
    cache2.clean(Date.now());
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});