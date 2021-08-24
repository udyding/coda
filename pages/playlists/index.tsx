import { GetStaticProps } from "next";
import { signIn, useSession, getSession } from "next-auth/client";
import Link from "next/link";
import Layout from "../../components/Layout";
import Playlists from "../../components/Playlists";
const axios = require("axios");

// page that lists out the users playlists before they start a listening session

// type Props = {
//   userId: string;
// };

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

// const WithStaticProps = ({ userId }: Props) => (
//   <Layout title="Playlists | Coda">
//     <h1>My Playlists</h1>
//     <Playlists userId={userId} />
//   </Layout>
// );

// get a user's playlists
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   // Example for including static props in a Next.js function component page.
//   // Don't forget to include the respective types for any props passed into
//   // the component.
//   const session = await getSession();
//   const userId = "22zxbnekkwhg7dyhbdrdnmwai";
//   try {
//     // axios.get("api/playSongs/addToQueue").then((response) => {
//     //   console.log("!!!!!!!!!!!!!!!!!!!!");
//     // });
//     const response = await axios({
//       method: "GET",
//       url: `api/playlists/getPlaylists?userId=${userId}`,
//     });
//     // const playlists = response.data; // array of playlist objects
//     // const items: PlaylistItem[] = playlists;
//     return { props: {} };
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

export default UsersPlaylistsPage;
