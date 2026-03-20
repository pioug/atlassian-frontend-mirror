import { defineMessages } from 'react-intl-next';

export const codeBlockMessages: {
	codeblockLanguageAriaDescription: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	codeBlockLanguageNotSet: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	codeblockLanguageAriaDescription: {
		id: 'fabric.editor.codeBlock.languageAriaDescription',
		defaultMessage: 'Code snippet language: {language}.',
		description:
			'A short message that provides information about what code language is being used in a code block for accessibility purposes, punctuation mark at the end as another message comes after',
	},
	codeBlockLanguageNotSet: {
		id: 'fabric.editor.codeBlock.languageNotSet',
		defaultMessage: 'Code language not set.',
		description:
			'A short message that provides information that the code block language has not been set for accessibility purposes, punctuation mark at the end as another message comes after',
	},
});
