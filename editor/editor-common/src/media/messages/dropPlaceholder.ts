import { defineMessages } from 'react-intl';

export const dropPlaceholderMessages: {
	dropPlaceholderLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	dropPlaceholderLabel: {
		id: 'fabric.editor.dropPlaceholderLabel',
		defaultMessage: 'Document',
		description:
			'The text is shown as the label for the document icon in the media drop placeholder, displayed when a file is being dragged over the editor and the target is a document-type media item.',
	},
});
