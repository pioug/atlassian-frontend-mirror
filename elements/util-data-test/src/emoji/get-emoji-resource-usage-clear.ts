import { EmojiResourceUsageClear } from './emoji-resource-usage-clear';
import { getEmojis } from './get-emojis';

export const getEmojiResourceUsageClear = (): EmojiResourceUsageClear =>
	new EmojiResourceUsageClear(getEmojis());
