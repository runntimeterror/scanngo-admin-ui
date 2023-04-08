import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"></link>
      <Component {...pageProps} />
    </>
  )
}
