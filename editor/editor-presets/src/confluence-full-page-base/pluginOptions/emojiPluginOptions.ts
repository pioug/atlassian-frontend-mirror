import type { EmojiNodeDataProvider } from '@atlaskit/editor-plugin-emoji/EmojiNodeDataProvider';
import type { EmojiPluginOptions } from '@atlaskit/editor-plugin-emoji/emojiPluginType';
import type { EmojiProvider } from '@atlaskit/emoji/types';

interface Props {
	options: never;
	providers: {
		emojiNodeDataProvider: EmojiNodeDataProvider | undefined;
		emojiProvider: Promise<EmojiProvider> | undefined;
	};
}

export function emojiPluginOptions({ providers }: Props): EmojiPluginOptions {
	return {
		emojiProvider: providers.emojiProvider,
		emojiNodeDataProvider: providers.emojiNodeDataProvider,
	};
}
