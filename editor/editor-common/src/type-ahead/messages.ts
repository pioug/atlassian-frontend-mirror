import { defineMessages } from 'react-intl-next';

export const typeAheadListMessages = defineMessages({
	typeAheadPopupLabel: {
		id: 'fabric.editor.typeAhead.popupLabel',
		defaultMessage: 'Typeahead results',
		description: 'the result of a typeahead, similar to autocomplete results+',
	},
	quickInsertPopupLabel: {
		id: 'fabric.editor.typeAhead.quickInsertPopupLabel',
		defaultMessage: 'Shortcuts for inserts and formatting',
		description: 'the result of a quick insert typeahead, similar to autocomplete results+',
	},
	quickInsertInputLabel: {
		id: 'fabric.editor.typeAhead.quickInsertInputLabel',
		defaultMessage: 'Begin typing to search or filter shortcut options',
		description: 'assisitve text for typeahed input field',
	},
	quickInsertInputPlaceholderLabel: {
		id: 'fabric.editor.typeAhead.quickInsertInputPlaceholderLabel',
		defaultMessage: 'Search',
		description: 'placeholder for typeahed input field',
	},
	emojiPopupLabel: {
		id: 'fabric.editor.typeahead.emojiPopupLabel',
		defaultMessage: 'Emoji shortcuts',
		description: 'the result of a emoji typeahead, similar to autocomplete results+',
	},
	emojiInputLabel: {
		id: 'fabric.editor.typeahead.emojiInputLabel',
		defaultMessage: 'Begin typing to search or filter emoji options',
		description: 'assisitve text for typeahed input field',
	},
	mentionPopupLabel: {
		id: 'fabric.editor.typeahead.mentionPopupLabel',
		defaultMessage: 'Users you can tag',
		description: 'the aria label of a mention typeahead popup',
	},
	mentionInputLabel: {
		id: 'fabric.editor.typeahead.mentionInputLabel',
		defaultMessage: 'Begin typing to search for users to tag',
		description: 'assisitve text for typeahed input field',
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
		description: 'Description',
	},
	shortcutLabel: {
		id: 'fabric.editor.shortcut',
		defaultMessage: 'Text shortcut',
		description: 'Text shortcut',
	},
	offlineErrorFallbackHeading: {
		id: 'fabric.editor.offlineErrorFallbackHeading',
		defaultMessage: 'Something went wrong!',
		description: 'heading for offline error fallback when mentions are not available',
	},
	offlineErrorFallbackDesc: {
		id: 'fabric.editor.offlineErrorFallbackDescription',
		defaultMessage: 'Try reloading the page.',
		description: 'description for offline error fallback when mentions are not available',
	},
	viewAllInserts: {
		id: 'fablric.editor.viewAllInserts',
		defaultMessage: 'View all inserts',
		description:
			'a text on a button that opens a side panel with a list of all insertable editor elements',
	},
});
