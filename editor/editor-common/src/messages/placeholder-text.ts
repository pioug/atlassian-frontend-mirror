import { defineMessages } from 'react-intl-next';

export const placeholderTextMessages = defineMessages({
	placeholderTextPlaceholder: {
		id: 'fabric.editor.placeholderTextPlaceholder',
		defaultMessage: 'Add placeholder text',
		description: '',
	},
	shortEmptyNodePlaceholderText: {
		id: 'fabric.editor.shortEmptyNodePlaceholderText',
		defaultMessage: '/ to insert',
		description: 'Short placeholder text for empty nodes',
	},
	longEmptyNodePlaceholderText: {
		id: 'fabric.editor.longEmptyNodePlaceholderText',
		defaultMessage: 'Type / to insert elements',
		description: 'Long placeholder text for empty nodes',
	},
});
