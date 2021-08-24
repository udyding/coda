import React from "react";
import Link from "next/link";

import { PlaylistItem } from "../interfaces";

type Props = {
  data: PlaylistItem;
};

const Playlist = ({ data }: Props) => (
  <Link href="/start/[id]" as={`/users/${data.id}`}>
    <a>{data.displayName}</a>
  </Link>
);

export default Playlist;
