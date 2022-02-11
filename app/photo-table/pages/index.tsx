import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState, FormEventHandler } from 'react';
import styles from '../styles/Home.module.css'

type TablesResponseParams = {
  id: string,
}

const Home: NextPage = () => {
  const router = useRouter();
  const [tableName, setTableName] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ name: tableName });
    const response = await fetch('/api/tables', { method: 'POST', body, headers });

    if(response.status === 200) {
      const params = await response.json() as TablesResponseParams;

      router.push(`tables/${params.id}`);
    } else {
      console.log(response.statusText);
    }
  };

  return (
    <>
      <Head>
        <title>PhotoTable: Create a New Table</title>
        <meta name="description" content="Shared table space for curating images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4">
        <h1 className="text-2xl pb-4">
          Create a New Table
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            className="bg-slate-100 border-slate-200 border-2 p-1 mr-2"
            type="text"
            value={tableName}
            placeholder="Table name"
            onChange={(event) => setTableName(event.target.value)}
          />
          <input
            className="bg-slate-200 border-2 p-1"
            type="submit"
            value="Create Table"
          />
        </form>
      </main>
    </>
  )
}

export default Home
