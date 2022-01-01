import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection } from 'sharedb/lib/client';

type Props = {
  tableId: string,
}

const emptyTable = {
  images: [],
};

/*
  connection created when code is loaded. this isn't a sustainable solution; same
  doc for all instances of shared-table. This should be moved outside of the
  component lifecycle.
*/
const socket = new ReconnectingWebSocket('ws://localhost:8080');
const connection = new Connection(socket);
const sharedDoc = connection.get('tables', 'empty');

const SharedTable = ({ tableId }: Props) => {
  const [table, setTable] = useState(emptyTable);
  const [urlValue, setUrlValue] = useState('');

  // Subscribe so sharedDoc.data is updated when ops happen on server
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
    });

    return () => sharedDoc.unsubscribe();
  }, []);

  useEffect(() => {
    const handleLoad = () => setTable({ ...sharedDoc.data });

    sharedDoc.on('load', handleLoad);

    return () => sharedDoc.off('load', handleLoad);
  });

  useEffect(() => {
    const handleOp = () => setTable({ ...sharedDoc.data });

    sharedDoc.on('op', handleOp);

    return () => sharedDoc.off('op', handleOp);
  });

  const handleAddUrlSubmit = (event: Event) => {
    event.preventDefault();

    const path = ['images', table.images.length];
    const image = { url: urlValue };
    const op = [{ p: path, li: image }];
    sharedDoc.submitOp(op);

    setUrlValue('');
  }

  return (
    <div>
      <form onSubmit={handleAddUrlSubmit}>
        <input
          type="url"
          placeholder="Image URL"
          value={urlValue}
          onChange={(event: Event) => setUrlValue(event.target.value)}
        />
        <input type="submit" value="Add Image" />
      </form>
      <ul>
      { table.images.map((image, i) => <li key={image.url + i}>{image.url}</li>) }
      </ul>
    </div>
  );
};

export default SharedTable;
