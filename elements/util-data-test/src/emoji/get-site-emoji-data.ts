import { EmojiServiceResponse } from '../../../emoji/src/types';
import { siteEmojiWtf } from './site-emoji-wtf';

export const getSiteEmojiData = (): EmojiServiceResponse => ({
  emojis: [siteEmojiWtf],
});
