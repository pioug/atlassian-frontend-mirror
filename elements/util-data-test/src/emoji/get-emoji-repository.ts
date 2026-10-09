import EmojiRepository from '@atlaskit/emoji/emoji-repository';

import { getEmojis } from './get-emojis';

export const getEmojiRepository = (): EmojiRepository => new EmojiRepository(getEmojis());
