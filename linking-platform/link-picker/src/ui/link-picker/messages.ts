import { defineMessages } from 'react-intl-next';

export const searchMessages = defineMessages({
	linkLabel: {
		id: 'fabric.linkPicker.search.linkLabel',
		defaultMessage: 'Search or paste a link',
		description: 'Label for the link input',
	},
	linkAriaLabel: {
		id: 'fabric.linkPicker.search.linkAriaLabel',
		defaultMessage: 'Suggestions will appear below as you type into the field',
		description: 'Aria label for the link input',
	},
	linkPlaceholder: {
		id: 'fabric.linkPicker.search.linkPlaceholder',
		defaultMessage: 'Find recent links or paste a new link',
		description: 'Placeholder text for the link input',
	},
});

export const linkMessages = defineMessages({
	linkLabel: {
		id: 'fabric.linkPicker.linkLabel',
		defaultMessage: 'Link',
		description: 'Label for the link input',
	},
	linkAriaLabel: {
		id: 'fabric.linkPicker.linkAriaLabel',
		defaultMessage: 'Type or paste a link into the field',
		description: 'Aria label for the link input',
	},
	linkPlaceholder: {
		id: 'fabric.linkPicker.linkPlaceholder',
		defaultMessage: 'Paste a link',
		description: 'Placeholder text for the link input',
	},
});

export const formMessages = defineMessages({
	linkInvalid: {
		id: 'fabric.linkPicker.linkInvalid',
		defaultMessage: 'Enter a valid URL.',
		description: 'Error message shown for invalid links',
	},
	clearLink: {
		id: 'fabric.linkPicker.clearLink',
		defaultMessage: 'Clear',
		description: 'Tooltip message for link input clear button',
	},
});

export const linkTextMessages = defineMessages({
	linkTextLabel: {
		id: 'fabric.linkPicker.linkTextLabel',
		defaultMessage: 'Display text (optional)',
		description: 'Label for the link display input',
	},
	linkTextAriaLabel: {
		id: 'fabric.linkPicker.linkTextAriaLabel',
		defaultMessage: 'Link display text',
		description: 'Aria label for the link display input',
	},
	linkTextPlaceholder: {
		id: 'fabric.linkPicker.linkTextPlaceholder',
		defaultMessage: 'Text to display',
		description: 'Placeholder text for the link display input',
	},
	clearLinkText: {
		id: 'fabric.linkPicker.clearLinkText',
		defaultMessage: 'Clear text',
		description: 'Tooltip message for link input clear button',
	},
	linkHelperTextLabel: {
		id: 'fabric.linkPicker.linkHelperTextLabel',
		defaultMessage: 'Give this link a title or description',
		description: 'Helper text for the link display input',
	},
	linkHelperTextAriaLabel: {
		id: 'fabric.linkPicker.linkHelperTextAriaLabel',
		defaultMessage: 'Link display helper text',
		description: 'Aria label for the helper text of the link display input',
	},
});

export const timeMessages = defineMessages({
	updated: {
		id: 'fabric.linkPicker.time.message.updated',
		defaultMessage: 'Updated {time}',
		description:
			'Time last updated where {time} can be an absolute value e.g. June 5, 2023 or a relative value e.g. 3 hours ago',
	},
	viewed: {
		id: 'fabric.linkPicker.time.message.viewed',
		defaultMessage: 'Viewed {time}',
		description:
			'Time last viewed where {time} can be an absolute value e.g. June 5, 2023 or a relative value e.g. 3 hours ago',
	},
});
