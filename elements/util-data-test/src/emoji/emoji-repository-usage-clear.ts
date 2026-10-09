import EmojiRepository from '@atlaskit/emoji/emoji-repository';
import { type EmojiDescription } from '@atlaskit/emoji/types';

export const isUsageClearEmojiRepository = (object: any): object is EmojiRepositoryUsageClear => {
	return 'clear' in object;
};

export class EmojiRepositoryUsageClear extends EmojiRepository {
	constructor(emojis: EmojiDescription[]) {
		super(emojis);
	}

	clear(): void {
		this.usageTracker.clear();
	}
}
