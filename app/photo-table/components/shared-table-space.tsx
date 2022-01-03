import { useEffect, useState } from 'react';

type Props = {
  tableId: string,
  sharedDoc: any,
}

const emptyTable = {
  images: [],
};

const SharedTableSpace = ({ tableId, sharedDoc }: Props) => {
  const [table, setTable] = useState(emptyTable);
  const [urlValue, setUrlValue] = useState('');

  useEffect(() => {
    // Subscribe so sharedDoc.data is updated when ops happen on server
    sharedDoc.subscribe((error) => {
      if (error) return console.error(error);
    });

    return () => sharedDoc.unsubscribe();
  }, [sharedDoc]);

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

  const imageItem = (url: string, key: string) => {
    return (
      <li key={key}>
        <img src={url} />
      </li>
    );
  };

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
      { table.images.map((image, i) => imageItem(image.url, image.url + i)) }
      </ul>
    </div>
  );
};

export default SharedTableSpace;
