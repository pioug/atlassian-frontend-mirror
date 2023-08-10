import memoizeOne from 'memoize-one';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji';
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
