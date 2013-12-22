

var io = null;
var port = 8082;
var pingcount = 0; 
var express = require('express'),
    http = require('http'),
    path = require('path');
var app = express();
 
exports.settings={};
//These are dynamically updated by the runtime
//settings.appname - the app id (folder) where your app is installed
//settings.viewpath - prefix to where your view html files are located
//settings.staticurl - base url path to static assets /static/apps/appname
//settings.appurl - base url path to this app /app/appname
//settings.device_name - name given to this coder by the user, Ie."Billy's Coder"
//settings.coder_owner - name of the user, Ie. "Suzie Q."
//settings.coder_color - hex css color given to this coder.

exports.get_routes = [
    { path:'/', handler:'index_handler' },
];

exports.post_routes = [
    
];


exports.index_handler = function( req, res ) {
    
    //start up the server the first time this page loads
    if ( io === null ) {
        startSocketServer();
    }


    var tmplvars = {};
    tmplvars['static_url'] = exports.settings.staticurl;
    tmplvars['app_name'] = exports.settings.appname;
    tmplvars['app_url'] = exports.settings.appurl;
    tmplvars['device_name'] = exports.settings.device_name;

    tmplvars['socket_port'] = port;

    res.render( exports.settings.viewpath + '/index', tmplvars );
};

//make sure to kill the server when this module is destroyed.
//this happens every time you save this module in the editor.
//if you don't do this, you can reconnect to the port
exports.on_destroy = function() {
   if ( io !== null ) {
       io.server.close();
   }
}; 

    

var startSocketServer = function() {

    //this starts the server
//    var server = http.createServer(app),
//    io = require('socket.io').listen(server);
//
//    server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port')); 
//   });

    io = require('socket.io').listen( port );
    
    // creating an array of clients
//    var clients = {};

    
    io.sockets.on('connection', function (socket) {
        socket.on('devicemove', function(data){
            
            socket.broadcast.emit('movesquare', data);
        });
        
        // == Device Motion, values keep averaging to Zero
//        socket.on('devicemotion', function(data){
//            
//            socket.broadcast.emit('changepos', data);
//        });

        
        socket.emit('srvupdate', { data: 'connected' });
         socket.on('c_change', function(){
            socket.broadcast.emit('change', function(){
                });
        });
        
        
           
                
        //what we do when we get a clientupdate event from the client side javascript.
        socket.on('clientupdate', function (data) {
            console.log(data);
            console.log(socket.id);
            if ( data.data && data.data === "ping" ) {
                socket.emit('srvupdate', {data:'pong ' + pingcount});
                pingcount++;
            } else {
                socket.emit('srvupdate', {data:'unknown data: ' + data.data});
            }
        });
        
        });
         
};


