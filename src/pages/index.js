import Head from "next/head";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        window.location.href = "/dashboard";
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);
  return (
    <>
      <Head>
        <title>Scan N Go Admin</title>
        <meta name="description" content="Scan N Go Amin UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
