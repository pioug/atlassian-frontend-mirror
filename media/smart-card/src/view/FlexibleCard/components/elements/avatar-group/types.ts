import { ElementProps } from '../types';

export type AvatarItemProps = {
  /* The image to be used in an `@atlaskit/avatar - this should be a url to the image src */
  src?: string;
  /* The name of the person in the avatar. */
  name: string;
};

export type AvatarGroupProps = ElementProps & {
  items?: AvatarItemProps[];
  maxCount?: number;
};
