import { getTestEmojis } from './get-test-emojis';
import { TestEmojiRepository } from './test-emoji-repository';

export const getTestEmojiRepository: () => any = () =>
  new TestEmojiRepository(getTestEmojis());
