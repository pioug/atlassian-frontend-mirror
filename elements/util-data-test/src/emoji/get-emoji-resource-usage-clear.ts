import { getEmojis } from './get-emojis';
import { EmojiResourceUsageClear } from './emoji-resource-usage-clear';

export const getEmojiResourceUsageClear = (): EmojiResourceUsageClear => new EmojiResourceUsageClear(getEmojis());
