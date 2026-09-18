import type { EmojiProvider } from '../src/resource';
import type { OnEmojiEvent, RelativePosition } from '../src/types';

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
