import { useEffect, useState } from 'react';
import styles from './SharedTableSpace.module.css';

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
  };

  const handleRemoveClick = (index: number) => {
    const path = ['images', index];
    const image = table.images[index];
    const op = [{ p: path, ld: image }];

    sharedDoc.submitOp(op);
  };

  const imageItem = (url: string, index:number) => {
    return (
      <li key={url + index}>
        <img src={url} />
        <button onClick={() => handleRemoveClick(index)}>Remove</button>
      </li>
    );
  };

  return (
    <div className={styles['shared-table-space']}>
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
      { table.images.map((image, i) => imageItem(image.url, i)) }
      </ul>
    </div>
  );
};

export default SharedTableSpace;
