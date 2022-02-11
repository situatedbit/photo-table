var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var ShareDBMingo = require('sharedb-mingo-memory');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var json0 = require('ot-json0');

ShareDB.types.register(json0.type);
var backend = new ShareDB({ db: new ShareDBMingo() });

startServer();

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}
