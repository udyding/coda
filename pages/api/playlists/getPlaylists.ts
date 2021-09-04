import { getToken } from "next-auth/jwt";
const axios = require("axios");
const secret = process.env.SECRET;

// gets the playlist Id, name, and cover for all playlists for the given user
export default async (req, res) => {
  const token = await getToken({ req, secret });
  const accessToken = token.accessToken;
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
    res.send(playlists);
    return playlists;
  } catch (err) {
    console.log(err);
  }
};
