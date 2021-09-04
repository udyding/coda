import { signIn, useSession, getSession } from "next-auth/client";
import Layout from "../../components/Layout";
import Playlists from "../../components/Playlists";

// page that lists out the users playlists before they start a listening session

const UsersPlaylistsPage = () => {
  const [session, loading] = useSession();

  return (
    <Layout title="Playlists | Coda">
      {!session && (
        <>
          <button onClick={signIn}>
            <a>Sign In</a>
          </button>
        </>
      )}

      {session && (
        <>
          <h1>My Playlists</h1>
          <Playlists userId={session.user.user.id} />
        </>
      )}
    </Layout>
  );
};

export default UsersPlaylistsPage;
