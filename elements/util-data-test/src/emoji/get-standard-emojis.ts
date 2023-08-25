import memoizeOne from 'memoize-one';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
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
