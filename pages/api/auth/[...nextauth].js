import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Spotify({
      scope:
        "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-modify-playback-state playlist-modify-public playlist-modify-private",
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessTokenUrl: "https://accounts.spotify.com/api/token",
      authorizationUrl:
        "https://accounts.spotify.com/authorize?response_type=code",
      profileUrl: "https://api.spotify.com/v1/me",
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
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
});

// export default function Spotify(options) {
//   return {
//     id: "spotify",
//     name: "Spotify",
//     type: "oauth",
//     version: "2.0",
//     scope: "user-read-email",
//     params: { grant_type: "authorization_code" },
//     accessTokenUrl: "https://accounts.spotify.com/api/token",
//     authorizationUrl:
//       "https://accounts.spotify.com/authorize?response_type=code",
//     profileUrl: "https://api.spotify.com/v1/me",
//     profile(profile) {
//       return {
//         id: profile.id,
//         name: profile.display_name,
//         email: profile.email,
//         image: profile.images?.[0]?.url,
//       }
//     },
//     ...options,
//   }
// }
