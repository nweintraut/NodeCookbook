var io = require('socket.io').listen(8081);
var sioclient = require('socket.io-client');
// var   redis     = require('redis')
var   redis         = require('socket.io/node_modules/redis')
    , RedisStore    = require('socket.io/lib/stores/redis')
    , redisConfig = require('./Redis/redis_config');


function makeRedisClient() { 
  var redisClient = redis.createClient(redisConfig.redisPort, redisConfig.redisHost, {});
  redisClient.on("error", function(err){
    console.log("Redis Error: [" + err + "]");
  });
  redisClient.auth(redisConfig.redisAuthentication, function(error, reply){
    if (error) {console.log(">>>>>>>> Redis Authentication Failed: [" + error +"]");}
    else {console.log("Redis Authentication Response is: [" + reply + "]");}
  });
  return redisClient;
}

var pub = makeRedisClient()
  , sub = makeRedisClient()
  , client = makeRedisClient(); 

var widgetScript = require('fs').readFileSync('widget_client.js');
var url = require('url');

var totals = {};
totals = client;

io.configure(function(){
   io.set('resource', '/loc');
   
   io.set('store', new RedisStore({
      redis: redis
    , redisPub: pub
    , redisSub: sub
    , redisClient: client
    })
   );

   io.enable('browser client gzip');
});
sioclient.builder(io.transports(), function(err, siojs){
    if(err){console.log("error in sioclient builder " + err.message);}
    if(!err){
        io.static.add('/widget.js', function(path, callback){
            callback(null, new Buffer(siojs + ";" + widgetScript));
        });
    }
});
io.sockets.on('connection', function(socket){
   var origin = (socket.handshake.xdomain) ? url.parse(socket.handshake.headers.origin). hostname : 'local';
//   totals[origin] = (totals[origin]) || 0;
//   totals[origin] += 1;
   socket.join(origin);
   totals.incr(origin, function(err, total){
    io.sockets.to(origin).emit('total', total);
   });
   
   io.sockets.to(origin).emit('total', totals[origin]);
   socket.on('disconnect', function(){
       totals.decr(origin, function(err, total){
          io.sockets.to(origin).emit('total', total);

       });
   });
});