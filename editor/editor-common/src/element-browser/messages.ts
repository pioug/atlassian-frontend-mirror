import { defineMessages } from 'react-intl';

type MessageKeys =
	| 'assistiveTextDefault'
	| 'assistiveTextResult'
	| 'elementAfterInputMessage'
	| 'elementListAriaLabel'
	| 'placeHolderMessage'
	| 'searchAriaLabel'
	| 'searchAriaLabelNew';

const message: Record<MessageKeys, { defaultMessage: string; description?: string; id: string }> =
	defineMessages({
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
		elementListAriaLabel: {
			id: 'fabric.editor.elementbrowser.elementlist.ariaLabel',
			defaultMessage: 'Select element',
			description:
				'The text is used as an aria-label for the element browser listbox. It provides an accessible name for screen readers to identify the list of elements that can be selected and inserted.',
		},
		searchAriaLabel: {
			id: 'fabric.editor.elementbrowser.searchbar.ariaLabel',
			defaultMessage: 'Search',
			description:
				'The text is used as an aria-label for the search input field in the element browser. It provides an accessible name for screen readers to identify the search field.',
		},
		searchAriaLabelNew: {
			id: 'fabric.editor.elementbrowser.searchbar.ariaLabel.new',
			defaultMessage: 'Search elements',
			description:
				'The updated text used as an aria-label for the search input field in the element browser. It provides a more descriptive accessible name for screen readers to identify the search field.',
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
			description:
				'Assistive text to describe the list of suggestions filtered by typed user input',
		},
	});

export default message;
