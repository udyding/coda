import React, { useEffect } from 'react'
import ListItem from './ListItem'
import { User } from '../interfaces'
import axios from 'axios';

type Props = {
  items: User[]
}
const List = ({ items }: Props) => {
  useEffect(() => {
    const playlistId = "2PF13ZUdpgZgdCNtOZ3zCv";
    getPlaylist(playlistId);
  });

  const setExistingSongs = (playlistSongArr) => {
    // key is song ID, value is the location of song ('0' if already in playlist, '1' if rejected already)
    const songIDArr = [];
    playlistSongArr.forEach((song) => {
      const key = song.track.id;
      const obj = {};
      obj[key] = false;
      songIDArr.push(obj);
    });
    localStorage.setItem("existingSongs", JSON.stringify(songIDArr));
    console.log(JSON.stringify(songIDArr));
  }
  const getPlaylist = (playlistId) => {
    axios.get('api/playSongs/prepareSession', {
      params: {
        playlistId: playlistId
      }
    })
      .then((response) => {
        console.log(response);
        if ("localStorage" in window && window?.localStorage !== null) {
          setExistingSongs(response.data.items);
        }
        getRecommendedSongs('6iWMI5oOhWrDbLbjmwTWFq');
      })
  }

  const getRecommendedSongs = (songId) => {
    axios.get('api/playSongs/findSongs', {
      params: {
        songId: songId,
        songAmount: 15
      }
    })
      .then((response) => {
        const songArr = response.data.tracks;
        const songIds = songArr.map((song) => song.id);
        console.log(songIds)
        setRecommendedSongs(songIds);
      })
  }

  const setRecommendedSongs = (recommendedSongArr) => {
    const songIDArr = JSON.parse(localStorage.getItem('existingSongs'));
    recommendedSongArr.forEach((song) => {
      if (!songIDArr[song]) {
        const key = song;
        const obj = {};
        obj[key] = true;
        songIDArr.push(obj);
      }
    });
    localStorage.setItem("existingSongs", JSON.stringify(songIDArr));
  }

  const addRecommendedSongs = async () => {
    const keys = Object.keys(localStorage);
    const getRandomIndex = async (playlistLength) => {
      return Math.floor(Math.random() * playlistLength);
    }

    const playlistLength = JSON.parse(localStorage.getItem("playlistLength"));
    let backlog = JSON.parse(localStorage.getItem("backlog"));
    let randomIndex = Math.floor(Math.random() * playlistLength); // gets random index

    while (
      keys[randomIndex] === "playlistLength" ||
      keys[randomIndex] === "backlog"
    ) {
      randomIndex = await getRandomIndex(playlistLength);
    }
    const songIds = [];
    axios.get('api/playSongs/addToQueue', {
      params: {
        songIds: songIds
      }
    })
      .then((response) => {
        console.log(response);
        if ("localStorage" in window && window?.localStorage !== null) {
          setExistingSongs(response.data.items);
        }
      })
    const amtQueueAddedSongs = songIds.length;
    backlog -= amtQueueAddedSongs - 15;
    localStorage.setItem("backlog", JSON.stringify(backlog));
    return amtQueueAddedSongs;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <ListItem data={item} />
        </li>
      ))}
    </ul>
  )
}

export default List
