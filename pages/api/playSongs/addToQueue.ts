const axios = require("axios");
import { getAccessToken } from "../../../lib/spotify";
let timer;

export default async (req, res) => {
  const accessToken = await getAccessToken();

  async function getRandomIndex(playlistLength) {
    return Math.floor(Math.random() * playlistLength);
  }

  async function addRecommendedSongs() {
    const keys = Object.keys(localStorage);
    const playlistLength = JSON.parse(localStorage.getItem("playlistLength"));
    let backlog = JSON.parse(localStorage.getItem("backlog"));
    let randomIndex = Math.floor(
      Math.random() * JSON.parse(localStorage.getItem("playlistLength"))
    ); // gets random index
    while (
      keys[randomIndex] === "playlistLength" ||
      keys[randomIndex] === "backlog"
    ) {
      randomIndex = await getRandomIndex(playlistLength);
    }
    const songIds = await findRecommendations(
      localStorage.getItem(keys[randomIndex]),
      15 + backlog,
      accessToken
    );
    await addSongsToCurrentUserQueue(songIds, accessToken);
    const amtQueueAddedSongs = songIds.length;
    backlog -= amtQueueAddedSongs - 15;
    localStorage.setItem("backlog", JSON.stringify(backlog));
    return amtQueueAddedSongs;
  }

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

  // takes in a songId and finds recommended songs for it
  async function findRecommendations(songId, amtOfNeededSongs, accessToken) {
    try {
      // get recommendations endpoint
      const response = await axios({
        method: "GET",
        url: `https://api.spotify.com/v1/recommendations?limit=${amtOfNeededSongs}&seed_tracks=${songId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      let data = response.data.tracks;
      const songIds = data.map((song) => song.id);
      const uniqueSongIds = songIds.filter(
        (id) => localStorage.getItem(id) === null
      ); // get rid of songs in playlist or already listened to
      return uniqueSongIds;
    } catch (err) {
      console.log(err);
    }
  }

  timer = setTimeout(addRecommendedSongs, 60000); // add new songs every minute
};

export const endSession = async () => {
  clearTimeout(timer);
  localStorage.clear();
};
