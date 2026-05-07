import { defineMessages } from 'react-intl';

export const messages: {
	toolbarLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	pageActionsLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	editableContentLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	toolbarLabel: {
		id: 'fabric.editor.toolbarLabel',
		defaultMessage: 'Editor',
		description:
			'ARIA region landmark label identifying the editor toolbar area to screen reader users.',
	},
	pageActionsLabel: {
		id: 'fabric.editor.pageActionsLabel',
		defaultMessage: 'Page actions',
		description:
			'ARIA region landmark label identifying the page actions area (e.g. publish, share) to screen reader users.',
	},
	editableContentLabel: {
		id: 'fabric.editor.editableContentLabel',
		defaultMessage: 'Editable content',
		description:
			'ARIA region landmark label identifying the main editable content area of the editor to screen reader users.',
	},
});
