import { getTestSiteEmojis } from './get-test-site-emojis';
import { TestEmojiRepository } from './test-emoji-repository';

export const getTestSiteEmojiRepository: () => any = () =>
  new TestEmojiRepository(getTestSiteEmojis().emojis);
