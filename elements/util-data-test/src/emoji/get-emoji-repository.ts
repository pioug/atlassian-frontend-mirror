import { EmojiRepository } from '@atlaskit/emoji/resource';
import { getEmojis } from './get-emojis';

export const getEmojiRepository = (): any => new EmojiRepository(getEmojis());
