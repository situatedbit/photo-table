require('dotenv').config();

var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var mongodb = require('sharedb-mongo');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var json0 = require('ot-json0');

ShareDB.types.register(json0.type);

function connectionString(env) {
  const user = env.MONGO_ROOT_USER;
  const password = env.MONGO_ROOT_USER_PASSWORD;
  const domain = env.MONGO_DOMAIN;
  const port = env.MONGO_PORT;

  return `mongodb://${user}:${password}@${domain}:${port}`;
}

var backend = new ShareDB({
  db: mongodb(connectionString(process.env)),
});

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
