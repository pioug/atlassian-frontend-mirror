import { defineMessages } from 'react-intl-next';

export const captionMessages = defineMessages({
	placeholder: {
		id: 'fabric.editor.captionPlaceholder',
		defaultMessage: 'Add a caption',
		description: 'Placeholder description for an empty (new) caption in the editor',
	},
	placeholderWithDoubleClickPrompt: {
		id: 'fabric.editor.captionPlaceholderWithDoubleClickPrompt',
		defaultMessage: 'Add a caption - double-click to preview',
		description:
			'Placeholder description to prompt users to add a caption and double click media to preview',
	},
});
