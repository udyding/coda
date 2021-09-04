import React, { useEffect } from "react";
import ListItem from "./ListItem";
import { User } from "../interfaces";
import axios from "axios";

type Props = {
  items: User[];
};
const List = ({ items }: Props) => {
  useEffect(() => {
    const playlistId = "3n8Mq04SfjWllVhbvd2qOy";
    getPlaylist(playlistId);
  });

  // Add existing songs in the playlist to local storage
  const setExistingSongs = (playlistSongArr) => {
    // key is song ID, value is the location of song ('0' if already in playlist, '1' if rejected already)
    const songMap = new Map();

    playlistSongArr.forEach((song) => {
      songMap.set(song.track.id, true);
    });
    localStorage.setItem(
      "backlog",
      JSON.stringify(Array.from(songMap.entries()))
    );
  };

  // sets up playlist
  const getPlaylist = (playlistId) => {
    axios
      .get("api/playSongs/prepareSession", {
        params: {
          playlistId: playlistId,
        },
      })
      .then((response) => {
        console.log(response);
        if ("localStorage" in window && window?.localStorage !== null) {
          setExistingSongs(response.data.items);
        }
        getRecommendedSongs("6iWMI5oOhWrDbLbjmwTWFq");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // calls findSongs API & runs returned songs through setRecommendedSongs
  const getRecommendedSongs = (songId) => {
    axios
      .get("api/playSongs/findSongs", {
        params: {
          songId: songId,
          songAmount: 15,
        },
      })
      .then((response) => {
        const songArr = response.data.tracks;
        const songIds = songArr.map((song) => song.id);
        console.log(songIds);
        setRecommendedSongs(songIds);
        addRecommendedSongs();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // adds recommended songs to local storage
  const setRecommendedSongs = (recommendedSongArr) => {
    const songIDArr = [];
    const songMap = new Map(JSON.parse(localStorage.getItem("backlog")));
    recommendedSongArr.forEach((song) => {
      if (!songMap.get(song)) {
        songMap.set(song, false);
      }
    });
    localStorage.setItem(
      "backlog",
      JSON.stringify(Array.from(songMap.entries()))
    );
  };

  // adds recommended songs to players queue
  const addRecommendedSongs = async () => {
    const backlog = new Map(JSON.parse(localStorage.getItem("backlog")));
    let count = 0;

    const songArr = [];
    var mapSongArr = Array.from(backlog.keys());

    while (count < 15) {
      var len = mapSongArr.length;
      var rand = Math.floor(Math.random() * len);
      if (mapSongArr[rand]) {
        var key = mapSongArr[rand];
      }

      if (!backlog.get(key) && backlog.get(key) !== undefined) {
        songArr.push(key);
        count += 1;
      }
    }

    axios
      .get("api/playSongs/addToQueue", {
        params: {
          songIds: JSON.stringify(songArr),
        },
      })
      .then((response) => {
        console.log("response", response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <ListItem data={item} />
        </li>
      ))}
    </ul>
  );
};

export default List;
