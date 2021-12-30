import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection } from 'sharedb/lib/client';

type Props = {
  tableId: string,
}

const emptyTable = {
  images: [],
};

const SharedTable = ({ tableId }: Props) => {
  const [table, setTable] = useState(emptyTable);
  const socket = new ReconnectingWebSocket('ws://localhost:8080');
  const connection = new Connection(socket);
  const sharedDoc = connection.get('tables', 'empty');

  useEffect(() => {
    sharedDoc.subscribe((error) => {
      if (error) return console.error(error);

      console.log('subscribed');

      // If doc.type is undefined, the document has not been created, so let's create it
      if (!sharedDoc.type) {
        console.log('must create');
        sharedDoc.create({ images: [] }, (error) => {
          if (error) console.error(error);
        })
      }
    }, []); // disable fire on updates

    return () => sharedDoc.unsubscribe();
  });

  useEffect(() => {
    sharedDoc.on('load', () => {
      setTable(sharedDoc.data);
    });

    return () => sharedDoc.off('load', () => {});
  });

  useEffect(() => {
    sharedDoc.on('create', () => {
      setTable(sharedDoc.data);
    });

    return () => sharedDoc.off('create', () => {});
  });

  useEffect(() => {
    sharedDoc.on('op', () => {
      setTable(sharedDoc.data);
    });

    return () => sharedDoc.off('op', () => {});
  });

  return (
    <ul>
    { table.images.map((image) => <li key={image.url}>{image.url}</li>) }
    </ul>
  );
};

export default SharedTable;
