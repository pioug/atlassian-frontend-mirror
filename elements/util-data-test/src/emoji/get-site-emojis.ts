import memoizeOne from 'memoize-one';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji';
import { getSiteEmojiData } from './get-site-emoji-data';

export const getSiteEmojis = memoizeOne(() => {
  return denormaliseEmojiServiceResponse({
    emojis: getSiteEmojiData().emojis,
  }).emojis;
});
