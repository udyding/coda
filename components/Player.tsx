import * as React from "react";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

import { PlaylistInfo } from "../interfaces";

type Props = {
  playlistItem: PlaylistInfo;
};

const Player = ({ playlistItem }: Props) => (
  <div>
    <h1>{playlistItem.displayName}</h1>
  </div>
);

export default Player;
