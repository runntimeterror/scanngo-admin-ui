import "../styles/globals.css";
import "../styles/react-csv.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <Component {...pageProps} />
    </>
  );
}
