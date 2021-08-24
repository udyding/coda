// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number;
  name: string;
};

export type PlaylistImage = {
  height: number;
  url: string;
  width: number;
};

export type PlaylistItem = {
  canAddTo: boolean;
  id: string;
  displayName: string;
  images: PlaylistImage[];
};
