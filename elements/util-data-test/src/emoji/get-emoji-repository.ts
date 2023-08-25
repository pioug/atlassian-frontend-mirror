import { EmojiRepository } from '@atlaskit/emoji/resource';
import { getEmojis } from './get-emojis';

export const getEmojiRepository = () => new EmojiRepository(getEmojis());
