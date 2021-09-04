import React, { useEffect, useState } from "react";
const axios = require("axios");
import PlaylistLink from "./PlaylistLink";

type Props = {
  userId: string;
};

const Playlists = ({ userId }: Props) => {
  const [usersPlaylists, setUsersPlaylists] = useState([]);
  useEffect(() => {
    const getUsersPlaylists = async (userId) => {
      try {
        const response = await axios({
          method: "GET",
          url: `api/playlists/getPlaylists?userId=${userId}`,
        });
        setUsersPlaylists(response.data);
        return;
      } catch (err) {
        console.log(err);
      }
    };
    getUsersPlaylists(userId);
  }, []);

  return (
    <>
      <ul>
        {usersPlaylists.map((item) => (
          <li key={item.id}>
            <PlaylistLink data={item} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Playlists;
