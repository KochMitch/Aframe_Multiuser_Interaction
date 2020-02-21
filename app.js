'use strict';
const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const socketIO = require('socket.io')(server);

const PORT = 8080;

 // Set root dir to the public folder.
app.use((express.static(__dirname + '/public')));

server.listen(PORT);
console.log('listening to port: ' + PORT);
