import { useEffect, useState } from 'react';
import Image from './Image';
import TableBar from './TableBar';
import Viewport from './Viewport'
import { getSharedDoc } from '../models/client/sharedb';

type Props = {
  tableId: string,
}

const emptyTable = {
  images: [],
};

const SharedTable = ({ tableId }: Props) => {
  const [doc, setDoc] = useState(null)
  const [table, setTable] = useState(emptyTable);

  useEffect(() => {
    const newDoc = getSharedDoc('tables', tableId);

    newDoc.subscribe((error) => {
      if (error) return console.error(error);
    });

    const handleLoad = () => {
      setTable({ ...newDoc.data });
      console.log('loaded', { ...newDoc.data });
    };
    newDoc.on('load', handleLoad);

    const handleOp = () => {
      setTable({ ...newDoc.data });
      console.log('op', { ...newDoc.data });
    };
    newDoc.on('op', handleOp);

    setDoc(newDoc)

    return () => {
      newDoc.unsubscribe();
      newDoc.off('load', handleLoad);
      newDoc.off('op', handleOp);
    };
  }, [tableId]);

  const handleAddUrl = (url: string) => {
    const path = ['images', table.images.length];
    const image = {
      url,
      position: {
        left: 0,
        top: 0,
      },
    };
    const op = [{ p: path, li: image }];
console.log('adding url', url);
    doc.submitOp(op);
  };

  const handleImageRemove = (image, index: number) => {
    const path = ['images', index];
    const op = [{ p: path, ld: image }];

    doc.submitOp(op);
  };

  return (
    <>
      <TableBar onAddUrl={handleAddUrl} />
      <Viewport>
        { table.images.map((image, index) => {
          return(
            <Image
              key={image.url + index}
              image={image}
              onRemove={() => handleImageRemove(image, index)}
            />
          );
        })}
      </Viewport>
    </>
  );
};

export default SharedTable;
