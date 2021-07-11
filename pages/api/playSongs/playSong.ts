const axios = require("axios");
import { getAccessToken } from "../../../lib/spotify";

// gets the cover, title, album, and artist of the song
export const getSongInfo = async (req, res) => {
  const accessToken = await getAccessToken();
  const { songId } = req.query;
  try {
    // get a track endpoint
    const response = await axios({
      method: "GET",
      url: `https://api.spotify.com/v1/tracks/${songId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let data = response.data;
    let artists = data.artists.map((item) => item.name);
    let song = {
      name: data.name,
      artists: artists,
      album: data.album.name,
      image: data.album.images[0],
    };
    res.send("Successfully generated song details.");
    console.log(song);
    return true;
  } catch (err) {
    console.log(err);
  }
};

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

// takes in a song Id and brings the current user to the designated start point
export default async (req, res) => {
  const accessToken = await getAccessToken();
  const { songId } = req.query;
  let startPoint = await getStartPoint(songId, accessToken);
  startPoint = Math.floor(startPoint * 1000); // convert to milliseconds
  try {
    // seek to position in currently playing track endpoint
    await axios({
      method: "PUT",
      url: `https://api.spotify.com/v1/me/player/seek?position_ms=${startPoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.send(`Skipped to ${startPoint} of song.`);
    return startPoint;
  } catch (err) {
    console.log(err);
  }
};
