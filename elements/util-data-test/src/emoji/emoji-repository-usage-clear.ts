import { EmojiRepository } from '../../../emoji/src/resource';
import { EmojiDescription } from '../../../emoji/src/types';

export const isUsageClearEmojiRepository = (
  object: any,
): object is EmojiRepositoryUsageClear => {
  return 'clear' in object;
};

export class EmojiRepositoryUsageClear extends EmojiRepository {
  constructor(emojis: EmojiDescription[]) {
    super(emojis);
  }

  clear() {
    this.usageTracker.clear();
  }
}
