import { defineMessages } from 'react-intl';

export const messages: {
	clearLink: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	clearText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	displayText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	hyperlinkAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	linkVisibleLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchLinkAriaDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchLinkResults: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	textVisibleLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	displayText: {
		id: 'fabric.editor.displayText',
		defaultMessage: 'Text to display',
		description:
			'Label for the text input field in the hyperlink toolbar where users enter the display text for a link.',
	},
	clearText: {
		id: 'fabric.editor.clearLinkText',
		defaultMessage: 'Clear text',
		description:
			'The text is shown on a button in the hyperlink toolbar that clears the display text field, removing any custom link text the user has entered.',
	},
	clearLink: {
		id: 'fabric.editor.clearLink',
		defaultMessage: 'Clear link',
		description:
			'The text is shown on a button in the hyperlink toolbar that clears the URL field, removing any link address the user has entered.',
	},
	hyperlinkAriaLabel: {
		id: 'fabric.editor.hyperlink.ariaLabel',
		defaultMessage: 'Hyperlink Edit',
		description: 'Aria label for the Hyperlink Add Toolbar',
	},
	searchLinkAriaDescription: {
		id: 'fabric.editor.hyperlink.searchLinkAriaDescription',
		defaultMessage: 'Suggestions will appear below as you type into the field',
		description: 'Describes what the search field does for screen reader users.',
	},
	searchLinkResults: {
		id: 'fabric.editor.hyperlink.searchLinkResults',
		defaultMessage: '{count, plural, =0 {no results} one {# result} other {# results}} found',
		description: 'Announce search results for screen-reader users.',
	},
	linkVisibleLabel: {
		id: 'fabric.editor.hyperlink.linkVisibleLabel',
		defaultMessage: 'Paste or search for link',
		description: 'Visible label for link input in hyperlink floating control',
	},
	textVisibleLabel: {
		id: 'fabric.editor.hyperlink.textVisibleLabel',
		defaultMessage: 'Display text (optional)',
		description: 'Visible label for text input in hyperlink floating control',
	},
});
