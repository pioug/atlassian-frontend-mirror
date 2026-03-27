import { defineMessages } from 'react-intl-next';

export const pasteOptionsToolbarMessages: {
	markdown: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	markdownAction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	pasteMenuActionsPasteAs: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	pasteMenuActionsTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	pasteOptions: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	plainText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	plainTextAction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	richText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	richTextAction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	pasteOptions: {
		id: 'fabric.editor.pasteOptions',
		defaultMessage: 'Paste options',
		description: 'Opens a menu with additional paste options',
	},
	plainText: {
		id: 'fabric.editor.plainText',
		defaultMessage: 'Use plain text',
		description: 'Converts pasted text into plain text',
	},
	markdown: {
		id: 'fabric.editor.useMarkdown',
		defaultMessage: 'Use Markdown',
		description: 'Converts pasted text into Markdown',
	},
	richText: {
		id: 'fabric.editor.richText',
		defaultMessage: 'Use rich text',
		description: 'Converts pasted text into Rich text',
	},
	plainTextAction: {
		id: 'fabric.editor.plainTextAction',
		defaultMessage: 'Plain text',
		description: 'Converts pasted text into plain text',
	},
	markdownAction: {
		id: 'fabric.editor.useMarkdownAction',
		defaultMessage: 'Markdown',
		description: 'Converts pasted text into Markdown',
	},
	richTextAction: {
		id: 'fabric.editor.richTextAction',
		defaultMessage: 'Rich text',
		description: 'Converts pasted text into Rich text',
	},
	pasteMenuActionsTitle: {
		id: 'fabric.editor.pasteMenuActionsTitle',
		defaultMessage: 'Paste actions',
		description: 'Section title for actions in the paste options menu',
	},
	pasteMenuActionsPasteAs: {
		id: 'fabric.editor.pasteMenuActionsPasteAs',
		defaultMessage: 'Paste as',
		description:
			'Submenu title to surface pasting options to paste content as Markdown, Rich text or Plain text',
	},
});
