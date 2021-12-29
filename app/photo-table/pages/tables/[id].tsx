import type { GetServerSideProps } from 'next';

type Props = {
  id: string,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.query.id },
  }
}

const Table = ({ id }: Props) => {
  return (
    <div>Table {id}</div>
  );
}

export default Table
