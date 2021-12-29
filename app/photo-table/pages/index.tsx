import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'

type TablesResponseParams = {
  id: string,
}

const Home: NextPage = () => {
  const router = useRouter();

  const handleClick = async (event: Event) => {
    const response = await fetch('/api/tables', { method: 'POST' });

    const params = await response.json() as TablesResponseParams;

    router.push(`tables/${params.id}`);
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

        <form>
          <input type="button" value="Create Table" onClick={handleClick}/>
        </form>
      </main>
    </div>
  )
}

export default Home
