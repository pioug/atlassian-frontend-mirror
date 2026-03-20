import { defineMessages } from 'react-intl-next';

export const messages: {
	placeholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	placeholder: {
		id: 'fabric.editor.captionPlaceholder',
		defaultMessage: 'Add a caption',
		description: 'Placeholder description for an empty (new) caption in the editor',
	},
});
