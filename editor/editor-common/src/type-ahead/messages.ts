import { defineMessages } from 'react-intl';

export const typeAheadListMessages: {
	descriptionLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiInputLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiListItemLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPopupLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emptySearchResults: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emptySearchResultsSuggestion: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emptySearchResultsSuggestionAskRovoOnly: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emptySearchResultsSuggestionNew: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inputQueryAssistiveLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mentionInputLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mentionPopupLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	metionListItemLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noSearchResultsLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	quickInsertInputLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	quickInsertInputPlaceholderLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	quickInsertPopupLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchResultsLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	shortcutLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	typeAheadErrorFallbackDesc: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	typeAheadErrorFallbackHeading: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	typeAheadPopupLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	viewAllInserts: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	typeAheadPopupLabel: {
		id: 'fabric.editor.typeAhead.popupLabel',
		defaultMessage: 'Typeahead results',
		description:
			'ARIA label for the typeahead/autocomplete results popup. Announced to screen reader users when search or filter results appear.',
	},
	quickInsertPopupLabel: {
		id: 'fabric.editor.typeAhead.quickInsertPopupLabel',
		defaultMessage: 'Shortcuts for inserts and formatting',
		description:
			'ARIA label for the quick insert typeahead popup showing available shortcuts. Announced to screen readers when the popup appears.',
	},
	quickInsertInputLabel: {
		id: 'fabric.editor.typeAhead.quickInsertInputLabel',
		defaultMessage: 'Begin typing to search or filter shortcut options',
		description:
			'ARIA label for the quick insert typeahead input field, read by screen readers to inform users they can type to search or filter available editor shortcuts.',
	},
	quickInsertInputPlaceholderLabel: {
		id: 'fabric.editor.typeAhead.quickInsertInputPlaceholderLabel',
		defaultMessage: 'Search',
		description:
			'Placeholder text displayed inside the quick insert typeahead input field when it is empty, prompting users to type a search term.',
	},
	emojiPopupLabel: {
		id: 'fabric.editor.typeahead.emojiPopupLabel',
		defaultMessage: 'Emoji shortcuts',
		description: 'the result of a emoji typeahead, similar to autocomplete results+',
	},
	emojiInputLabel: {
		id: 'fabric.editor.typeahead.emojiInputLabel',
		defaultMessage: 'Begin typing to search or filter emoji options',
		description:
			'ARIA label for the emoji typeahead input field, read by screen readers to inform users they can type to search or filter available emoji options.',
	},
	mentionPopupLabel: {
		id: 'fabric.editor.typeahead.mentionPopupLabel',
		defaultMessage: 'Users you can tag',
		description: 'the aria label of a mention typeahead popup',
	},
	mentionInputLabel: {
		id: 'fabric.editor.typeahead.mentionInputLabel',
		defaultMessage: 'Begin typing to search for users to tag',
		description:
			'ARIA label for the mention typeahead input field, read by screen readers to inform users they can type to search for people to tag in the document.',
	},
	metionListItemLabel: {
		id: 'fabric.editor.typeahead.metionListItemLabel',
		defaultMessage: 'User {name} @{shortName}',
		description: 'assistive text for user mention items username and nickname',
	},
	emojiListItemLabel: {
		id: 'fabric.editor.typeahead.emojiListItemLabel',
		defaultMessage: 'Emoji {name} Text Shortcut {shortcut}',
		description: 'assistive text for emoji name and shortcut',
	},
	inputQueryAssistiveLabel: {
		id: 'fabric.editor.inputQueryAssistiveTxt',
		defaultMessage:
			'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.',
		description: 'Assistive text to the user when using typeahead shortcut',
	},
	searchResultsLabel: {
		id: 'fabric.editor.searchResults',
		defaultMessage:
			'{itemsLength, plural, one {# search result} other {# search results}} available. Use Up and Down arrow keys to navigate amongst the options. Press Enter to select an option.',
		description:
			'Assistive text to the user when using typeahead shortcut and it preceeds with a number - Ex: 10 search results available',
	},
	noSearchResultsLabel: {
		id: 'fabric.editor.noSearchResults',
		defaultMessage: 'No search results',
		description: 'Assistive text to the user when using typeahead shortcut',
	},
	descriptionLabel: {
		id: 'fabric.editor.description',
		defaultMessage: 'Description',
		description:
			'Label used as assistive text for the description of an item in the typeahead autocomplete dropdown list.',
	},
	shortcutLabel: {
		id: 'fabric.editor.shortcut',
		defaultMessage: 'Text shortcut',
		description:
			'Label used as assistive text before a keyboard shortcut in the typeahead autocomplete dropdown list items.',
	},
	typeAheadErrorFallbackHeading: {
		id: 'fabric.editor.typeAheadErrorFallbackHeading',
		defaultMessage: 'Something went wrong',
		description: 'Error message heading shown when typeahead items fail to load',
	},
	typeAheadErrorFallbackDesc: {
		id: 'fabric.editor.typeAheadErrorFallbackDescription',
		defaultMessage: 'No results available. Try again.',
		description: 'Error message description shown when typeahead items fail to load',
	},
	viewAllInserts: {
		id: 'fablric.editor.viewAllInserts',
		defaultMessage: 'View all inserts',
		description:
			'a text on a button that opens a side panel with a list of all insertable editor elements',
	},
	emptySearchResults: {
		id: 'fabric.editor.emptySearchResults',
		defaultMessage: "We couldn't find any results.",
		description: 'a message displayed when there are no search results',
	},
	emptySearchResultsSuggestion: {
		id: 'fabric.editor.emptySearchResultsSuggestion',
		defaultMessage: 'Select {buttonName} to browse inserts.',
		description:
			'a prompt to suggest user to click a button to browse inserts when there are no search results',
	},
	emptySearchResultsSuggestionNew: {
		id: 'fabric.editor.emptySearchResultsSuggestionNew',
		defaultMessage: 'Select {askRovoName} for help, or {buttonName} to browse inserts.',
		description:
			'a prompt to suggest user to click a button to browse inserts or ask Rovo for help when there are no search results',
	},
	emptySearchResultsSuggestionAskRovoOnly: {
		id: 'fabric.editor.emptySearchResultsSuggestionAskRovoOnly',
		defaultMessage: 'Select {askRovoName} for help.',
		description:
			'a prompt to suggest user to ask Rovo for help when there are no search results and no browse inserts button is available',
	},
});
