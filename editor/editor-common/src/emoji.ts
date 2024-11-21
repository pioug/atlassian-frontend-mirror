// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { default as Emoji } from './ui/Emoji';
export type { EmojiProps } from './ui/Emoji';
export { EmojiSharedCssClassName } from './styles/shared/emoji';
import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	emojiNodeLabel: {
		id: 'fabric.emoji.label',
		defaultMessage: 'Emoji',
		description: 'Label to indicate emoji node to Screen reader users',
	},
});
