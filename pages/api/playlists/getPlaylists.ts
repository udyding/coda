const axios = require("axios");
import { getAccessToken } from "../../../lib/spotify";

// gets the playlist Id, name, and cover for all playlists for the given user
export default async (req, res) => {
  const accessToken = await getAccessToken();
  const { userId } = req.query;
  try {
    // get a list of user's playlists endpoint
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/users/${userId}/playlists`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data.items;
    let playlists = data.map((item) => ({
      canAddTo: item.owner.id === userId || item.collaborative,
      id: item.id,
      displayName: item.name,
      images: item.images,
    }));
    console.log(playlists);
    res.send("Successfully loaded all playlists");
    return playlists;
  } catch (err) {
    console.log(err);
  }
};
