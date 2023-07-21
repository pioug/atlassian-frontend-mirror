import { EmojiRepository } from '../../../emoji/src/resource';
import { EmojiDescription } from '../../../emoji/src/types';
import { UsageFrequencyTracker } from '../../../emoji/src/utils';

export class TestEmojiRepository extends EmojiRepository {
  constructor(emojis: EmojiDescription[]) {
    super(emojis);
    this.usageTracker = new UsageFrequencyTracker(false);
  }
}
