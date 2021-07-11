const axios = require("axios");
import { getAccessToken } from "../../../lib/spotify";

// skips to next song in queue
async function skipSong(accessToken) {
  try {
    // Skip User’s Playback To Next Track endpoint
    await axios({
      method: "POST",
      url: `https://api.spotify.com/v1/me/player/next`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return "Skipped to next song.";
  } catch (err) {
    console.log(err);
  }
}

export default async (req, res) => {
  const accessToken = await getAccessToken();
  const { action, songId, playlistId } = req.query;
  let test = {};
  if (action === true) {
    try {
      // add items to a playlist endpoint
      const songUri = encodeURIComponent("spotify:track:" + songId);
      await axios({
        method: "POST",
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${songUri}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const playlistLength = JSON.parse(localStorage.getItem("playlistLength"));
      test[songId] = "0";
      // localStorage.setItem(songId, "0"); // added into playlist
      test["playlistLength"] = JSON.stringify(playlistLength + 1);
      // localStorage.setItem(
      //   "playlistLength",
      //   JSON.stringify(playlistLength + 1)
      // );
    } catch (err) {
      console.log(err);
      return "Could not add new song.";
    }
  } else {
    // add song to list of songs that are rejected
    localStorage.setItem(songId, "1");
    test[songId] = "1";
  }
  await skipSong(accessToken);
  res.send("Successfully processed new song.");
  return true;
};
