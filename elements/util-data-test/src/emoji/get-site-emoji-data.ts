// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiServiceResponse } from '@atlaskit/emoji/types';
import { siteEmojiWtf } from './site-emoji-wtf';

export const getSiteEmojiData = (): EmojiServiceResponse => ({
  emojis: [siteEmojiWtf],
});
