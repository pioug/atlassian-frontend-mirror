import { defineMessages } from 'react-intl';

export const findReplaceMessages: {
	closeFindReplaceDialog: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	find: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	findDialogAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	findNext: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	findPrevious: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	findReplaceDialogAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	findReplaceToolbarButton: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	matchCase: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noResultsFound: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	replace: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	replaceAll: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	replaceSuccess: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	replaceWith: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resultsCount: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	find: {
		id: 'fabric.editor.find',
		defaultMessage: 'Find',
		description: 'The word or phrase to search for on the document',
	},
	matchCase: {
		id: 'fabric.editor.matchCase',
		defaultMessage: 'Match case',
		description: 'Toggle whether should also match case when searching for text',
	},
	findNext: {
		id: 'fabric.editor.findNext',
		defaultMessage: 'Find next',
		description: 'Locate the next occurrence of the word or phrase that was searched for',
	},
	findPrevious: {
		id: 'fabric.editor.findPrevious',
		defaultMessage: 'Find previous',
		description: 'Locate the previous occurrence of the word or phrase that was searched for',
	},
	findReplaceDialogAriaLabel: {
		id: 'fabric.editor.findReplaceDialogAriaLabel',
		defaultMessage: 'Find and Replace',
		description: 'Aria label for the "Find and Replace" dialog',
	},
	findDialogAriaLabel: {
		id: 'fabric.editor.findDialogAriaLabel',
		defaultMessage: 'Find',
		description:
			'Aria label for the "Find" dialog, used where the dialog offers find without replace',
	},
	closeFindReplaceDialog: {
		id: 'fabric.editor.closeFindReplaceDialog',
		defaultMessage: 'Close',
		description: 'Cancel search and close the "Find and Replace" dialog',
	},
	noResultsFound: {
		id: 'fabric.editor.noResultsFound',
		defaultMessage: 'No results',
		description: 'No matches were found for the word or phrase that was searched for',
	},
	resultsCount: {
		id: 'fabric.editor.resultsCount',
		description: 'Text for selected search match position and total results count',
		defaultMessage: '{selectedMatchPosition} of {totalResultsCount}',
	},
	findReplaceToolbarButton: {
		id: 'fabric.editor.findReplaceToolbarButton',
		defaultMessage: 'Find and replace',
		description:
			'"Find" highlights all instances of a word or phrase on the document, and "Replace" changes one or all of those instances to something else',
	},
	replaceWith: {
		id: 'fabric.editor.replaceWith',
		defaultMessage: 'Replace with',
		description: 'The value that will replace the word or phrase that was searched for',
	},
	replace: {
		id: 'fabric.editor.replace',
		defaultMessage: 'Replace',
		description: 'Replace only the currently selected instance of the word or phrase',
	},
	replaceAll: {
		id: 'fabric.editor.replaceAll',
		defaultMessage: 'Replace all',
		description: 'Replace all instances of the word or phrase throughout the entire document',
	},
	replaceSuccess: {
		id: 'fabric.editor.replaceSuccess',
		defaultMessage: '{numberOfMatches, plural, one {# match replaced} other {# matches replaced}}',
		description:
			'Status message shown after a find-and-replace operation completes. The placeholder {numberOfMatches} is the count of replaced matches and controls the plural form (one vs. other).',
	},
});
