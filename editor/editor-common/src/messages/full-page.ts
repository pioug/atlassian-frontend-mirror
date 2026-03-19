import { defineMessages } from 'react-intl-next';

export const messages: {
    toolbarLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; pageActionsLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; editableContentLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	toolbarLabel: {
		id: 'fabric.editor.toolbarLabel',
		defaultMessage: 'Editor',
		description: 'Label for the ARIA region landmark',
	},
	pageActionsLabel: {
		id: 'fabric.editor.pageActionsLabel',
		defaultMessage: 'Page actions',
		description: 'Label for the ARIA region landmark',
	},
	editableContentLabel: {
		id: 'fabric.editor.editableContentLabel',
		defaultMessage: 'Editable content',
		description: 'Label for the ARIA region landmark',
	},
});
