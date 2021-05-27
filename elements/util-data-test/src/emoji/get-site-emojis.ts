import memoizeOne from 'memoize-one';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getSiteEmojiData } from './get-site-emoji-data';

export const getSiteEmojis = memoizeOne(() => {
  return denormaliseEmojiServiceResponse({
    emojis: getSiteEmojiData().emojis,
  }).emojis;
});
