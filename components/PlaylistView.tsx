import * as React from "react";

import { PlaylistItem } from "../interfaces";

type PlaylistViewProps = {
  item: PlaylistItem;
};

const PlaylistView = ({ item: playlist }: PlaylistViewProps) => (
  <div>
    <h1>{playlist.displayName}</h1>
    <p>hello hello</p>
  </div>
);

export default PlaylistView;
