import type { OnEmojiEvent, RelativePosition } from '../src/types';
import type { EmojiProvider } from '../src/resource';

export interface TypeaheadProps {
	emojiProvider: Promise<EmojiProvider>;
	label: string;
	onSelection: OnEmojiEvent;
	position?: RelativePosition;
}

export interface TypeaheadState {
	active: boolean;
	query?: string;
}
