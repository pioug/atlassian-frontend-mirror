import { EmojiRepository } from '../../../emoji/src/resource';
import { getEmojis } from './get-emojis';

export const getEmojiRepository = () => new EmojiRepository(getEmojis());
