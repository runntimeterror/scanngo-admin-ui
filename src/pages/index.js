import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Scan N Go Admin</title>
        <meta name="description" content="Scan N Go Amin UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      </main>
    </>
  )
}