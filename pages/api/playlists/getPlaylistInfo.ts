import { getToken } from "next-auth/jwt";
const axios = require("axios");
const secret = process.env.SECRET;

// gets the id, name, cover, and list of songs w their basic info for a single playlist
export default async (req, res) => {
  const token = await getToken({ req, secret });
  const accessToken = token.accessToken;
  const { playlistId } = req.query;
  try {
    // get a playlist endpoint
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${playlistId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data;
    // only get basic info for the first 15 songs
    let tracks = data.tracks.items.slice(0, 15).map((item) => ({
      name: item.track.name,
      artists: item.track.artists.map((artist) => artist.name),
    }));
    let playlist = {
      id: data.id,
      displayName: data.name,
      owner: data.owner.display_name,
      images: data.images,
      tracks: tracks,
    };
    res.send(playlist);
    return playlist;
  } catch (err) {
    console.log(err);
  }
};
