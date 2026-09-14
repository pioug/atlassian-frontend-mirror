import { type EmojiResourceConfig } from '../src/resource';

export function getEmojiConfig(allowUpload = true): any {
	let emojiConfig;
	try {
		// eslint-disable-next-line @repo/internal/import/no-unresolved
		emojiConfig = require('../local-config')['default'] as EmojiResourceConfig;
		if (!emojiConfig) {
			throw new Error(
				'No config found in local-config.ts. Please fill it with the proper configuration. local-config-example.ts file is used instead',
			);
		}
	} catch (e) {
		emojiConfig = require('../local-config-example')['default'] as EmojiResourceConfig;
	}

	emojiConfig.allowUpload = allowUpload;
	return emojiConfig;
}
