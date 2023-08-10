import memoizeOne from 'memoize-one';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji';
import { getStandardEmojiData } from './get-standard-emoji-data';

export const getStandardEmojis = memoizeOne(() => {
  const standardEmojis = getStandardEmojiData();
  const standardSprites = standardEmojis?.meta?.spriteSheets ?? {};

  return denormaliseEmojiServiceResponse({
    emojis: standardEmojis.emojis,
    meta: {
      spriteSheets: standardSprites,
    },
  }).emojis;
});
