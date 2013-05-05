var http    = require('http');
var querystring = require('querystring');
var util = require('util');
var fs = require('fs');
var formidable = require('formidable');
var form = fs.readFileSync('./content/form.html');
var connect = require('connect');
var port = process.env.PORT || 3000;
var form = require('fs').readFileSync('./content/form.html');
var maxData = 2 * 1024 * 1024; // 2mb

http.createServer(function(request, response){
// connect(connect.limit('64kb'), connect.bodyParser(), function(request, response){
    if(request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(form);
    } else if(request.method === 'POST') {
        var incoming = new formidable.IncomingForm();
        incoming.uploadDir = 'uploads';
//        incoming.maxFieldsSize = xxx; // limits size in bytes of non-file fields
        incoming.on('fileBegin', function(field, file){
            if(file.name) {
                file.path += "_" + file.name;
            }
        }).on('file', function(field, file){
            if(!file.size) {return;}
            else {
            response.write(file.name + ' received\n');
            }
        }).on('field', function(field, value){
            response.write(field + ' : ' + value + '\n');
        }).on('end', function(){
            response.end("All files received");
        });
        incoming.parse(request);

    } else if (request.method === 'PUT'){
        var fileData = new Buffer(+request.headers['content-length']);
        var bufferOffset = 0;
        request.on('data', function(chunk){
            chunk.copy(fileData, bufferOffset);
            bufferOffset += chunk.length;
        }).on('end', function() {
            var rand = (Math.random()*Math.random()).toString(16).replace('.','');
            var to = 'uploads/'+ rand + "_" + request.headers['x-uploadedfilename'];
            fs.writeFile(to, fileData, function(err){
               if(err){throw err;}
               console.log('Saved file to ' + to);
               response.end();
            });
        });
        
    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});