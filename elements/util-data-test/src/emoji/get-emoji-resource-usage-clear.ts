import { getEmojis } from './get-emojis';
import { EmojiResourceUsageClear } from './emoji-resource-usage-clear';

export const getEmojiResourceUsageClear = () =>
  new EmojiResourceUsageClear(getEmojis());
