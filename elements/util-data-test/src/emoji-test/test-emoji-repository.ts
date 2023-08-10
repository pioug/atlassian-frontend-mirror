// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
/* eslint-disable import/no-extraneous-dependencies */
import { EmojiRepository } from '@atlaskit/emoji/resource';
import { EmojiDescription } from '@atlaskit/emoji/types';
import { UsageFrequencyTracker } from '@atlaskit/emoji';
/* eslint-disable import/no-extraneous-dependencies */

export class TestEmojiRepository extends EmojiRepository {
  constructor(emojis: EmojiDescription[]) {
    super(emojis);
    this.usageTracker = new UsageFrequencyTracker(false);
  }
}
