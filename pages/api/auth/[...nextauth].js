import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const response = await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      body: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshedTokens = response.data;

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token if there is no given refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // user logs in using Spotify account and is then redirected
  providers: [
    Providers.Spotify({
      scope:
        "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-modify-playback-state playlist-modify-public playlist-modify-private",
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      // accessTokenUrl: "https://accounts.spotify.com/api/token",
      authorizationUrl:
        "https://accounts.spotify.com/authorize?response_type=code",
      // profileUrl: "https://api.spotify.com/v1/me",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url,
        };
      },
    }),
  ],
  // retrieve the JWT (json web token containing needed info for getting access_token)
  callbacks: {
    async jwt(token, user, account) {
      // initial sign in, only time where user and account are defined
      if (account && user) {
        return {
          accessToken: account.accessToken,
          accessTokenExpires: Date.now() + account.expires_in * 1000, // convert to milliseconds
          refreshToken: account.refreshToken,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
  secret: process.env.SECRET,
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
});
