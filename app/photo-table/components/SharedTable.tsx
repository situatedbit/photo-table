import { useEffect, useState } from 'react';
import SharedTableSpace from './SharedTableSpace';
import { getSharedDoc } from '../models/client/sharedb';

type Props = {
  tableId: string,
}

const SharedTable = ({ tableId }: Props) => {
  return (
    <SharedTableSpace tableId={tableId} sharedDoc={getSharedDoc('tables', tableId)} />
  );
};

export default SharedTable;
