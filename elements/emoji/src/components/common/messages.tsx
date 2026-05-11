import { defineMessages } from 'react-intl';

export const messages: {
	addCustomEmojiLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	addCustomEmojiLabel: {
		id: 'addCustomEmojiLabel',
		defaultMessage: 'Add custom emoji',
		description: 'Accessible label for add custom emoji button',
	},
});
