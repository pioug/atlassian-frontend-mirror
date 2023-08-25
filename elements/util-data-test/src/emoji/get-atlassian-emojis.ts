import memoizeOne from 'memoize-one';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getAtlassianEmojiData } from './get-atlassian-emoji-data';

export const getAtlassianEmojis = memoizeOne(() => {
  const atlassianEmojis = getAtlassianEmojiData();
  const atlassianSprites = atlassianEmojis?.meta?.spriteSheets ?? {};

  return denormaliseEmojiServiceResponse({
    emojis: atlassianEmojis.emojis,
    meta: {
      spriteSheets: atlassianSprites,
    },
  }).emojis;
});
