import { defineMessages } from 'react-intl';

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
		description:
			'Label for the paste option button that strips all formatting and pastes content as plain text.',
	},
	markdown: {
		id: 'fabric.editor.useMarkdown',
		defaultMessage: 'Use Markdown',
		description:
			'Label for the paste option button that pastes content with Markdown formatting preserved.',
	},
	richText: {
		id: 'fabric.editor.richText',
		defaultMessage: 'Use rich text',
		description:
			'Label for the paste option button that pastes content preserving rich text formatting (e.g. bold, links, headings).',
	},
	plainTextAction: {
		id: 'fabric.editor.plainTextAction',
		defaultMessage: 'Plain text',
		description:
			'Drop-down menu item label for the action that pastes the clipboard content as plain text, stripping all formatting.',
	},
	markdownAction: {
		id: 'fabric.editor.useMarkdownAction',
		defaultMessage: 'Markdown',
		description:
			'Drop-down menu item label for the action that pastes the clipboard content with Markdown formatting applied.',
	},
	richTextAction: {
		id: 'fabric.editor.richTextAction',
		defaultMessage: 'Rich text',
		description:
			'Drop-down menu item label for the action that pastes the clipboard content preserving rich text formatting.',
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
