import EmojiRepository from '@atlaskit/emoji/emoji-repository';
import { type EmojiDescription } from '@atlaskit/emoji/types';
import { UsageFrequencyTracker } from '@atlaskit/emoji/usage-frequency-tracker';

export class TestEmojiRepository extends EmojiRepository {
	constructor(emojis: EmojiDescription[]) {
		super(emojis);
		this.usageTracker = new UsageFrequencyTracker(false);
	}
}
