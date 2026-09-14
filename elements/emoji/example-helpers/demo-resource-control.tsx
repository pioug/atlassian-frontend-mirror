import { type ReactElement } from 'react';

import { type EmojiProvider, type EmojiResourceConfig } from '../src/resource';

export interface Props {
	children: ReactElement<any>;
	customEmojiProvider?: Promise<EmojiProvider>;
	customPadding?: number;
	emojiConfig: EmojiResourceConfig;
}
