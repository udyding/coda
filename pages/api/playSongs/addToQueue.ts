import { getToken } from "next-auth/jwt";
const axios = require("axios");
const secret = process.env.SECRET;
let timer;

export default async (req, res) => {
  const token = await getToken({ req, secret });
  const accessToken = token.accessToken;

  async function addSongsToCurrentUserQueue(songIds, accessToken) {
    let addQueuePromises = [];
    try {
      const songIdsLength = songIds.length;
      for (let i = 0; i < songIdsLength; i++) {
        const songUri = encodeURIComponent("spotify:track:" + songIds[i]);
        // add an item to the queue endpoint
        const promise = axios({
          method: "POST",
          url: `https://api.spotify.com/v1/me/player/queue?uri=${songUri}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        addQueuePromises.push(promise);
      }
      Promise.all(addQueuePromises).then(function (values) {
        console.log(values);
      });
      res.send("Added new songs to the queue");
      return true;
    } catch (err) {
      console.log(err);
    }
  }
};

export const endSession = async () => {
  clearTimeout(timer);
  localStorage.clear();
};
