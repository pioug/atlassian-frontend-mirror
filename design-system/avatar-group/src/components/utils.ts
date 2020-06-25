import { AvatarPropTypes } from '@atlaskit/avatar';

const MAX_IMAGE_SRC_LENGTH = 32;

const compact = (items: Array<string>) =>
  items.filter(item => item && item.length > 0);

export const composeAUniqueKey = (props: AvatarPropTypes, index: number) => {
  const name = props.name || '';
  const src = props.src || '';

  // when src is base64 encoded, it can be extremely long, and substring from the rear
  // as in most cases that is where the different sits. For example:
  // - https://www.avatar-sources.com/stephen.png?size=48
  // - https://www.avatar-sources.com/john.png?size=48
  const truncatedImageSrc = src.substring(
    src.length - MAX_IMAGE_SRC_LENGTH,
    src.length,
  );

  const key = compact([name, truncatedImageSrc]).join('-');

  if (key.length === 0) {
    return String(index);
  }

  return key;
};
