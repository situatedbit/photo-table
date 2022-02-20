import Head from "next/head";
import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const DynamicLoadingSharedTable = dynamic(
  () => import("@/components/DynamicLoadingSharedTable"),
  {
    ssr: false,
  }
);

type Props = {
  id: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.query.id },
  };
};

const TablePage = ({ id }: Props) => {
  return (
    <>
      <Head>
        <title>Table: {id}</title>
      </Head>
      <main>
        <DynamicLoadingSharedTable tableId={id} />
      </main>
    </>
  );
};

export default TablePage;
