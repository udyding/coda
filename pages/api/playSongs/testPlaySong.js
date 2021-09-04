const axios = require("axios");

// testing the time of getting the start point of today's top hits (50 songs), no cache
// takes in a song ID and returns the point in the song that will be played
export const getStartPoint = async (songId, accessToken) => {
  try {
    // Get Audio Analysis for a Track endpoint
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/audio-analysis/${songId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data;
    let sections = data.sections; // array of sections created by spotify
    let songLength = data.track.duration;
    let counter = sections.length - 1;
    let avgLoudness = data.track.loudness;
    let sectionLoudness;
    let currLongEnough = {
      loudness: 0,
      startPoint: 0,
    };
    let sampleStartPoint;
    while (counter >= 0) {
      sampleStartPoint = sections[counter].start;
      sectionLoudness = sections[counter].loudness;
      if (
        sectionLoudness >= avgLoudness &&
        sampleStartPoint + 16 <= songLength
      ) {
        sampleStartPoint = sampleStartPoint;
        break;
      } else if (
        sampleStartPoint + 16 <= songLength &&
        sectionLoudness > currLongEnough.loudness
      ) {
        currLongEnough.startPoint = sampleStartPoint;
      }
      counter -= 1;
    }
    if (sampleStartPoint === null) {
      sampleStartPoint = currLongEnough.startPoint || 0;
    }
    if (sampleStartPoint === 0) {
      return 1;
    } else {
      return sampleStartPoint - 1; // give time for fade in
    }
  } catch (err) {
    if (err.response.data.error.message === "analysis not found") {
      return 1; // just start song at beginning
    } else {
      console.log(err.response);
    }
  }
};

async function loadPlaylistSongs(playlistId, accessToken) {
  try {
    let songIds = [];
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(id))`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data.items;
    let dataLength = data.length;
    // key is song ID, value is the location of song ('0' if already in playlist, '1' if rejected already)
    let currSongId;
    for (let i = 0; i < dataLength; i++) {
      currSongId = data[i].track.id;
      songIds[i] = currSongId;
    }
    return songIds;
  } catch (err) {
    console.log(err);
  }
}

// takes in a song Id and brings the current user to the designated start point
// grab all 50 songs from today's top hits, iterate thru each song and add the time to an object, then return the object
export default async (req, res) => {
  const playlistId = "37i9dQZF1DXcBWIGoYBM5M";
  const accessToken =
    "BQBMIUNW33OM-OcNQ3f4DSU5zaVZmne5r9zjR1nG7clsTe4ioSKWFq5g5irEEZp8A-kLUvlM9h2O_A2UFH96rW6BbbLdIcdDlgqZgIfGWKiQmcCqmfS3tomkLs8Dqja_jUqWnz_SJwB8PVQoNNRMaoAaN3FUa7MnCpb5UQ";
  const songIds = await loadPlaylistSongs(playlistId, accessToken);
  let currSongId = "";
  let startPoint;
  let startPoints = [];

  console.time("getting song start points");
  console.log("song", songIds);
  // today's top hits always has 50 songs
  for (let i = 0; i < 50; i++) {
    currSongId = songIds[i];
    startPoint = await getStartPoint(currSongId, accessToken);
    startPoint = Math.floor(startPoint * 1000); // convert to milliseconds
    startPoints[i] = startPoint;
  }
  console.timeEnd("getting song start points");
  res.send(startPoints);
};
