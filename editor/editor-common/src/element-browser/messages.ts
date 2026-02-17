import { defineMessages } from 'react-intl-next';
export default defineMessages({
	elementAfterInputMessage: {
		id: 'fabric.editor.elementbrowser.searchbar.elementAfterInput',
		defaultMessage: 'Enter',
		description:
			'The text is shown as a label after the search input in the element browser. It indicates to the user that pressing Enter will insert the selected element.',
	},
	placeHolderMessage: {
		id: 'fabric.editor.elementbrowser.searchbar.placeholder',
		defaultMessage: 'Search',
		description:
			'The text is shown as placeholder text inside the search input field in the element browser. It prompts the user to type a query to filter available elements.',
	},
	searchAriaLabel: {
		id: 'fabric.editor.elementbrowser.searchbar.ariaLabel',
		defaultMessage: 'Search',
		description:
			'The text is used as an aria-label for the search input field in the element browser. It provides an accessible name for screen readers to identify the search field.',
	},
	assistiveTextDefault: {
		id: 'fabric.editor.elementbrowser.searchbar.assistive.text.default',
		defaultMessage:
			'{count, plural, =0 {Nothing matches your search.} one {{count} suggestion available by default.} other {{count} suggestions available by default.}}',
		description: 'Assistive text to describe the default list of suggestions',
	},
	assistiveTextResult: {
		id: 'fabric.editor.elementbrowser.searchbar.assistive.text.result',
		defaultMessage:
			'{count, plural, =0 {Nothing matches your search.} one {{count} suggestion available for typed text.} other {{count} suggestions available for typed text.}}',
		description: 'Assistive text to describe the list of suggestions filtered by typed user input',
	},
});
