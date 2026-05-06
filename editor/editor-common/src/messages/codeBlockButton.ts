import { defineMessages } from 'react-intl';

export const codeBlockButtonMessages: {
	copyCodeToClipboard: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	copiedCodeToClipboard: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	wrapCode: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	unwrapCode: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	selectLanguage: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	copyCodeToClipboard: {
		id: 'fabric.editor.codeBlockCopyButton.copyToClipboard',
		defaultMessage: 'Copy as text',
		description: 'Copy the content of the code block as text to your clipboard',
	},
	copiedCodeToClipboard: {
		id: 'fabric.editor.codeBlockCopyButton.copiedToClipboard',
		defaultMessage: 'Copied!',
		description: 'Copied the content of the code block as text to clipboard',
	},
	wrapCode: {
		id: 'fabric.editor.codeBlockWrapButton.wrapCodeBlock',
		defaultMessage: 'Turn on wrap',
		description:
			'Label for a toolbar button in the code block that enables line wrapping so long lines of code wrap to the next line instead of overflowing.',
	},
	unwrapCode: {
		id: 'fabric.editor.codeBlockWrapButton.unwrapCodeBlock',
		defaultMessage: 'Turn off wrap',
		description:
			'Label for a toolbar button in the code block that disables line wrapping so long lines of code extend horizontally without breaking.',
	},
	selectLanguage: {
		id: 'fabric.editor.selectLanguage',
		defaultMessage: 'Select language',
		description:
			'Code blocks display software code. A prompt to select the software language the code is written in.',
	},
});
