import * as React from "react";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

import { PlaylistInfo } from "../interfaces";

type Props = {
  playlistItem: PlaylistInfo;
};

const PlaylistView = ({ playlistItem }: Props) => (
  <div>
    <h1>{playlistItem.displayName}</h1>
    <ul>
      {playlistItem.tracks.map((item) => (
        <li>
          <h3>{item.name}</h3>
          {item.artists.map((artist) => (
            <a>{artist}, </a>
          ))}
        </li>
      ))}
    </ul>
    <Link href="/listening/[id]" as={`/listening/${playlistItem.id}`}>
      <a>Start listening</a>
    </Link>
  </div>
);

export default PlaylistView;
