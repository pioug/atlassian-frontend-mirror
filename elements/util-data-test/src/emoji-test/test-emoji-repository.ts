import { EmojiRepository } from '@atlaskit/emoji/resource';
import { EmojiDescription } from '@atlaskit/emoji/types';
import { UsageFrequencyTracker } from '@atlaskit/emoji/utils';

export class TestEmojiRepository extends EmojiRepository {
  constructor(emojis: EmojiDescription[]) {
    super(emojis);
    this.usageTracker = new UsageFrequencyTracker(false);
  }
}
