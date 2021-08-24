import Link from "next/link";
import Layout from "../components/Layout";
import { signIn, signOut, useSession } from "next-auth/client";

const IndexPage = () => {
  const [session, loading] = useSession();

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Coda</h1>
      {!session && (
        <>
          <button onClick={signIn}>
            <a>Sign In</a>
          </button>
        </>
      )}

      {session && (
        <>
          <h1>Welcome, {session.user.user.name}!</h1>
          <h1>Id: {session.user.user.id}</h1>
          <h1>Email: {session.user.user.email}</h1>
          {session.user.user.image && <img src={session.user.user.image}></img>}
          <br></br>
          <button onClick={signOut}>
            <a>Sign Out</a>
          </button>
          <br></br>
          <Link href="/playlists">
            <a>Start a session</a>
          </Link>
        </>
      )}
    </Layout>
  );
};

export default IndexPage;
