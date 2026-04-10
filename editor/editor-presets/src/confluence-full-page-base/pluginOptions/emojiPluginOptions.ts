import type { EmojiNodeDataProvider, EmojiPluginOptions } from '@atlaskit/editor-plugin-emoji';
import type { EmojiProvider } from '@atlaskit/emoji';

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
