import { useEffect, useState, useMemo } from 'react';
import { getSharedDoc, Doc, Error as ShareDBError } from '@/models/client/sharedb';
import { ListInsertOp } from 'sharedb';
import { Table } from '@/models/table';
import { Image } from '@/models/image';

const emptyTable: Table = {
  images: [] as Image[],
};

export function useSharedTable(tableId: string): [Doc<Table>, Table] {
  const [table, setTable] = useState(emptyTable);
  const doc = useMemo(() => getSharedDoc('tables', tableId), [tableId]);

  useEffect(() => {
    doc.subscribe((error: ShareDBError) => {
      if (error) return console.error(error);
    });

    const handleLoad = () => {
      setTable({ ...doc.data });
  // DEBUG
      console.log('loaded', { ...doc.data });
    };
    doc.on('load', handleLoad);

    const handleOp = () => {
      setTable({ ...doc.data });
  // DEBUG
      console.log('op', { ...doc.data });
    };
    doc.on('op', handleOp);

    return () => {
      doc.unsubscribe();
      doc.off('load', handleLoad);
      doc.off('op', handleOp);
    };
  }, [tableId, doc]);

  return [doc, table];
}

export function appendImageOp(images: Image[], image: Image): [ListInsertOp] {
  return [{ p: ['images', images.length], li: image }];
}
