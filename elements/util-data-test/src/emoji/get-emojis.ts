import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getAtlassianEmojiData } from './get-atlassian-emoji-data';
import { getSiteEmojiData } from './get-site-emoji-data';
import { getStandardEmojiData } from './get-standard-emoji-data';

export const getEmojis = () => {
  const standardEmojis = getStandardEmojiData();
  const atlassianEmojis = getAtlassianEmojiData();
  const siteEmojis = getSiteEmojiData();

  const standardSprites = standardEmojis?.meta?.spriteSheets ?? {};
  const atlassianSprites = atlassianEmojis?.meta?.spriteSheets ?? {};

  return denormaliseEmojiServiceResponse({
    emojis: [
      ...standardEmojis.emojis,
      ...atlassianEmojis.emojis,
      ...siteEmojis.emojis,
    ],
    meta: {
      spriteSheets: {
        ...standardSprites,
        ...atlassianSprites,
      },
    },
  }).emojis;
};
