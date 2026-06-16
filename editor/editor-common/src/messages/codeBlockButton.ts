import { defineMessages } from 'react-intl';

export const codeBlockButtonMessages: {
	all: {
		defaultMessage: string;
		description: string;
		id: string;
	};
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
	detectedLanguage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	detectLanguage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	downloadCodeBlock: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	formatCode: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	formatCodeFailed: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	formatCodeFailedAutoDetectedDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	formatCodeFailedDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	formatCodeUnavailable: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	hideLineNumbersLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noneDetected: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	recentlyUsed: {
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
	formatCode: {
		id: 'fabric.editor.codeBlockFormatButton.formatCode',
		defaultMessage: 'Format code',
		description: 'Tooltip for a code block toolbar button that formats code block content.',
	},
	formatCodeUnavailable: {
		id: 'fabric.editor.codeBlockFormatButton.formatCodeUnavailable',
		defaultMessage: 'Formatting not available for this language',
		description:
			'Tooltip for a disabled code block toolbar button when formatting is not available for the selected language.',
	},
	formatCodeFailed: {
		id: 'fabric.editor.codeBlockFormatButton.formatCodeFailed',
		defaultMessage: 'Code formatting failed',
		description: 'Title for an error flag shown when code formatting fails.',
	},
	formatCodeFailedDescription: {
		id: 'fabric.editor.codeBlockFormatButton.formatCodeFailedDescription',
		defaultMessage: 'Review the content or change the selected language.',
		description:
			'Description for an error flag shown when code formatting fails for a selected language.',
	},
	formatCodeFailedAutoDetectedDescription: {
		id: 'fabric.editor.codeBlockFormatButton.formatCodeFailedAutoDetectedDescription',
		defaultMessage: 'Review the content or select a specific language.',
		description:
			'Description for an error flag shown when code formatting fails for an automatically detected language.',
	},
	selectLanguage: {
		id: 'fabric.editor.selectLanguage',
		defaultMessage: 'Select language',
		description:
			'Code blocks display software code. A prompt to select the software language the code is written in.',
	},
	detectLanguage: {
		id: 'fabric.editor.codeBlock.detectLanguage',
		defaultMessage: 'Detect language',
		description:
			'Option in the code block language picker that clears the selected language so the editor can detect it automatically.',
	},
	detectedLanguage: {
		id: 'fabric.editor.codeBlock.detectedLanguage',
		defaultMessage: '{language} (detected)',
		description:
			'Label in the code block language picker trigger when the editor detected the code language. The language placeholder is the detected language name, such as JavaScript.',
	},
	noneDetected: {
		id: 'fabric.editor.codeBlock.noneDetected',
		defaultMessage: '(None detected)',
		description:
			'Label in the code block language picker trigger when the editor could not detect a code language.',
	},
	recentlyUsed: {
		id: 'fabric.editor.codeBlock.recentlyUsed',
		defaultMessage: 'Recently used',
		description: 'Section heading for recently used languages in the code block language picker.',
	},
	all: {
		id: 'fabric.editor.codeBlock.all',
		defaultMessage: 'All',
		description: 'Section heading for all languages in the code block language picker.',
	},
	downloadCodeBlock: {
		id: 'fabric.editor.codeBlockDownloadButton.downloadCodeBlock',
		defaultMessage: 'Download',
		description: 'Download the content of the code block as a file',
	},
});
