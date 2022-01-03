import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Home.module.css'

type TablesResponseParams = {
  id: string,
}

const Home: NextPage = () => {
  const router = useRouter();
  const [tableName, setTableName] = useState('');

  const handleSubmit = async (event: Event) => {
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
    <div>
      <Head>
        <title>PhotoTable: Create a New Table</title>
        <meta name="description" content="Shared table space for curating images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Create a New Table
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={tableName}
            placeholder="Table name"
            onChange={(event) => setTableName(event.target.value)}
          />
          <input type="submit" value="Create Table" />
        </form>
      </main>
    </div>
  )
}

export default Home
