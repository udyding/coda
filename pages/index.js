import Link from "next/link";
import Layout from "../components/Layout";
import { signIn, signOut, useSession } from "next-auth/client";

const IndexPage = () => {
  const [session, loading] = useSession();

  console.log(useSession());
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hey Next.js 👋</h1>
      {!session && (
        <>
          <button onClick={signIn}>
            <a>Sign In</a>
          </button>
        </>
      )}

      {session && (
        <>
          <h1>Signed in as {session.user.email}</h1>
          <button onClick={signOut}>
            <a>Sign Out</a>
          </button>
        </>
      )}
    </Layout>
  );
};

export default IndexPage;
