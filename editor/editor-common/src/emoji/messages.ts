import { defineMessages } from 'react-intl';

export const messages: {
	emojiNodeLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	emojiNodeLabel: {
		id: 'fabric.emoji.label',
		defaultMessage: 'Emoji',
		description: 'Label to indicate emoji node to Screen reader users',
	},
});
