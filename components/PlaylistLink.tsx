import React from "react";
import Link from "next/link";

import { PlaylistItem } from "../interfaces";

type Props = {
  data: PlaylistItem;
};

const PlaylistLink = ({ data }: Props) => {
  if (!data.canAddTo) {
    return <a>{data.displayName}</a>;
  }
  return (
    <Link href="/playlists/[id]" as={`/playlists/${data.id}`}>
      <a>{data.displayName}</a>
    </Link>
  );
};

export default PlaylistLink;
