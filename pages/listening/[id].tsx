import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
const axios = require("axios");

import { PlaylistInfo } from "../../interfaces";
import Layout from "../../components/Layout";
import Player from "../../components/Player";

const WebPlayer = () => {
  const router = useRouter();
  const { id } = router.query;
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>();
  useEffect(() => {
    const getPlaylistInfo = async (playlistId) => {
      try {
        const response = await axios({
          method: "GET",
          url: `/api/playlists/getPlaylistInfo?playlistId=${playlistId}`,
        });
        setPlaylistInfo(response.data);
        return;
      } catch (err) {
        console.log(err);
      }
    };

    if (id) {
      getPlaylistInfo(id);
    }
  }, [id]);

  return (
    <Layout title={`${playlistInfo?.displayName || "Untitled"} | Coda`}>
      {playlistInfo && <Player playlistItem={playlistInfo} />}
    </Layout>
  );
};

export default WebPlayer;
