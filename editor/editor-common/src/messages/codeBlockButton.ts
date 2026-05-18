import { defineMessages } from 'react-intl';

export const codeBlockButtonMessages: {
	copiedCodeToClipboard: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	copyCodeToClipboard: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	hideLineNumbersLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	selectLanguage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	showLineNumbersLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unwrapCode: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unwrapCodeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	wrapCode: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	wrapCodeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
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
	// Remove wrapCode/unwrapCode and use wrapCodeLabel/unwrapCodeLabel
	// when cleaning up platform_editor_code_block_q4_lovability.
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
	wrapCodeLabel: {
		id: 'fabric.editor.codeBlockWrapButton.wrapCode',
		defaultMessage: 'Wrap code',
		description:
			'Tooltip for a code block toolbar button that turns on line wrapping. This is shown when code is not wrapped.',
	},
	unwrapCodeLabel: {
		id: 'fabric.editor.codeBlockWrapButton.unwrapCode',
		defaultMessage: 'Unwrap code',
		description:
			'Tooltip for a code block toolbar button that turns off line wrapping. This is shown when code is wrapped.',
	},
	showLineNumbersLabel: {
		id: 'fabric.editor.codeBlockLineNumbersButton.showLineNumbers',
		defaultMessage: 'Show line numbers',
		description:
			'Tooltip for a code block toolbar button that shows line numbers. This is shown when line numbers are hidden.',
	},
	hideLineNumbersLabel: {
		id: 'fabric.editor.codeBlockLineNumbersButton.hideLineNumbers',
		defaultMessage: 'Hide line numbers',
		description:
			'Tooltip for a code block toolbar button that hides line numbers. This is shown when line numbers are visible.',
	},
	selectLanguage: {
		id: 'fabric.editor.selectLanguage',
		defaultMessage: 'Select language',
		description:
			'Code blocks display software code. A prompt to select the software language the code is written in.',
	},
});
