import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection, Doc } from 'sharedb/lib/client';

// Socket from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sharedb/lib/sharedb.d.ts
// Type definitions for ReconnectingWebSocket and sharedb connection socket do
// not match.
// TODO: find cleaner mechanism to make types compatible.
interface Socket {
  readyState: number;

  close(reason?: number): void;
  send(data: any): void;

  onmessage: (event: any) => void;
  onclose: (event: any) => void;
  onerror: (event: any) => void;
  onopen: (event: any) => void;
}

let socket: ReconnectingWebSocket;
let connection: Connection;

export function getSharedDoc(collection: string, id: string): Doc<any> {
  if(!connection) {
    socket = new ReconnectingWebSocket('ws://localhost:8080');
    connection = new Connection(socket as Socket);
  }

  return connection.get(collection, id);
};

export type { Doc } from 'sharedb/lib/client';
export type { Error } from 'sharedb';
