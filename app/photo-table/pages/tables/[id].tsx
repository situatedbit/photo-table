import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const SharedTable = dynamic(
  () => import('../../components/SharedTable'),
  { ssr: false },
);

type Props = {
  id: string,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.query.id },
  }
}

const TablePage = ({ id }: Props) => {
  return (
    <>
      <div>Table {id}</div>
      <SharedTable tableId={id} />
    </>
  );
}

export default TablePage;
