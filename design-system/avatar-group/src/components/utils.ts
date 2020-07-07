import { AvatarProps } from './types';

export const composeUniqueKey = (props: AvatarProps, index: number) => {
  if (props.key) {
    return props.key;
  }
  return index;
};
