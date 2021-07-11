import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// retrieves access token with given parameters for auth
export const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  const retval = await response.json();
  return retval.access_token;
};

// https://accounts.spotify.com/authorize?client_id=efb3282f5f9e421a97f52a367c5d0f12&response_type=code&redirect_uri=http
// %3A%2F%2Flocalhost:3000&scope=playlist-read-private%20playlist-read-collaborative%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private

// curl -H "Authorization: Basic ZWZiMzI4MmY1ZjllNDIxYTk3ZjUyYTM2N2M1ZDBmMTI6MGRlOTVhM2MxNTczNGEzM2FmZDhlYzg0NDI4ZjE5NDc=" -d grant_type=authorization_code -d code=AQCHzO_O6fO7phmun_oaCTGL42okClELz6NWampE1J7TsTlWs51P6BEf6FWaqRYces49ESTG6bfE9Oekm0Stm1PIbI_ZT9M5Naz00HolWLs7yzKq7FaB1FH-1efMKPPrg9LDj9lZL3D-0U4gSSU5k1GJtWyB8iVYFFoOa60t1EY8WANCSAFdY5tpoz_4gbxLLaHnGo_suJobteR2QS0AgpxZldFAUU2EC1sdakx4zc32ComICV3o-vqfsxXsA_jLkEUddgSaM61sFwwKSQ8QLLJaCXkkCY_jucs0bNjTCaAft2gISglQX_I3GaMtpMbxP7iqQIxedAhBpg -d redirect_uri=http%3A%2F%2Flocalhost:3000 https://accounts.spotify.com/api/token
