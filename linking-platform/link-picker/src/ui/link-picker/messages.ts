import { defineMessages } from 'react-intl';

export const searchMessages: {
	linkLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkPlaceholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	linkLabel: {
		id: 'fabric.linkPicker.search.linkLabel',
		defaultMessage: 'Search or paste a link',
		description:
			'Label shown above the URL input field in the link picker when search mode is active',
	},
	linkAriaLabel: {
		id: 'fabric.linkPicker.search.linkAriaLabel',
		defaultMessage: 'Suggestions will appear below as you type into the field',
		description:
			'Accessible aria-label for the URL search input field in the link picker, informing screen reader users that suggestions will appear as they type',
	},
	linkPlaceholder: {
		id: 'fabric.linkPicker.search.linkPlaceholder',
		defaultMessage: 'Find recent links or paste a new link',
		description:
			'Placeholder text shown inside the URL search input field in the link picker before the user types',
	},
});

export const linkMessages: {
	linkLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkPlaceholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	linkLabel: {
		id: 'fabric.linkPicker.linkLabel',
		defaultMessage: 'Link',
		description:
			'Label shown above the URL input field in the link picker when in paste-only mode (no search)',
	},
	linkAriaLabel: {
		id: 'fabric.linkPicker.linkAriaLabel',
		defaultMessage: 'Type or paste a link into the field',
		description:
			'Accessible aria-label for the URL input field in the link picker when in paste-only mode, used by screen readers',
	},
	linkPlaceholder: {
		id: 'fabric.linkPicker.linkPlaceholder',
		defaultMessage: 'Paste a link',
		description:
			'Placeholder text shown inside the URL input field in the link picker when in paste-only mode before the user types',
	},
});

export const formMessages: {
	linkInvalid: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	clearLink: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	noEmbedAvailable: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	linkInvalid: {
		id: 'fabric.linkPicker.linkInvalid',
		defaultMessage: 'Enter a valid URL.',
		description:
			'Validation error message displayed below the URL input field in the link picker when the entered value is not a valid URL',
	},
	clearLink: {
		id: 'fabric.linkPicker.clearLink',
		defaultMessage: 'Clear',
		description: 'Tooltip message for link input clear button',
	},
	noEmbedAvailable: {
		id: 'fabric.linkPicker.noEmbed',
		defaultMessage:
			"Embed view isn't supported for this link. <a>More about why some Smart Links don't display content.</a>",
		description: 'Error message shown for links without embeds',
	},
});

export const linkTextMessages: {
	linkTextLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkTextAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkTextPlaceholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	clearLinkText: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkHelperTextLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	linkHelperTextAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	linkTextLabel: {
		id: 'fabric.linkPicker.linkTextLabel',
		defaultMessage: 'Display text (optional)',
		description:
			'Label shown above the display text input field in the link picker, where users can optionally enter the visible link text',
	},
	linkTextAriaLabel: {
		id: 'fabric.linkPicker.linkTextAriaLabel',
		defaultMessage: 'Link display text',
		description:
			'Accessible aria-label for the display text input field in the link picker, used by screen readers',
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
		description:
			'Helper text shown below the display text input in the link picker, prompting users to provide a title or description for the link',
	},
	linkHelperTextAriaLabel: {
		id: 'fabric.linkPicker.linkHelperTextAriaLabel',
		defaultMessage: 'Link display helper text',
		description: 'Aria label for the helper text of the link display input',
	},
});

export const timeMessages: {
	updated: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	viewed: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
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
