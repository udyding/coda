import { getToken } from "next-auth/jwt";
const axios = require("axios");
const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await getToken({ req, secret });
  const accessToken = token.accessToken;
  const { songId, songAmount } = req.query;

  const response = await findRecommendations(songId, songAmount, accessToken);
  res.send(response.data);
}
// takes in a songId and finds recommended songs for it
async function findRecommendations(songId, songAmount, accessToken) {
  try {
    // get recommendations endpoint
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/recommendations?seed_artists=&seed_genres=&seed_tracks=${songId}&limit=${songAmount}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}
