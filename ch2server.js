var http    = require('http');
var querystring = require('querystring');
var util = require('util');
var formidable = require('formidable');
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

    }
}).listen(port, function(){
    console.log ("Listening on port " + port + ".");
});