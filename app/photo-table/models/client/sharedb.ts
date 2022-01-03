import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection } from 'sharedb/lib/client';

let socket;
let connection;

export function getSharedDoc(collection: string, id: string) {
  if(!connection) {
    socket = new ReconnectingWebSocket('ws://localhost:8080');
    connection = new Connection(socket);
  }

  return connection.get(collection, id);
}
