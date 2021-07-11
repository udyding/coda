const axios = require("axios");
import { getAccessToken } from "../../../lib/spotify";

export default async (req, res) => {
  const accessToken = await getAccessToken();
  const { playlistId } = req.query;
  // first ensure browser supports local storage
  await loadPlaylistSongs(playlistId, accessToken);
  if ("localStorage" in window && window["localStorage"] !== null) {
    await loadPlaylistSongs(playlistId, accessToken);
  }
  res.send("Successfully loaded playlist songs to local storage.");
};

async function loadPlaylistSongs(playlistId, accessToken) {
  try {
    // get a playlist's items
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(id))`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data.items;
    let dataLength = data.length;
    // key is song ID, value is the location of song ('0' if already in playlist, '1' if rejected already)
    let currSongId;
    for (let i = 0; i < dataLength; i++) {
      currSongId = data[i].track.id;
      localStorage.setItem(currSongId, "0");
    }
    localStorage.setItem("playlistLength", `${dataLength}`); // keep track of amount of songs
    localStorage.setItem("backlog", "0"); // if the recommendations don't return 15, compensate for this loss on next retrieval
    return true;
  } catch (err) {
    console.log(err);
  }
}
