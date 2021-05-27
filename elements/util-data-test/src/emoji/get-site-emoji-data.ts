import { EmojiServiceResponse } from '@atlaskit/emoji/types';
import { siteEmojiWtf } from './site-emoji-wtf';

export const getSiteEmojiData = (): EmojiServiceResponse => ({
  emojis: [siteEmojiWtf],
});
