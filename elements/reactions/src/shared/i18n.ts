import { defineMessages } from 'react-intl';

export const messages: {
	addNewReaction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	addReaction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	closeReactionsDialog: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiName: {
		// eslint-disable-next-line @atlassian/i18n/no-useless-message
		defaultMessage: string;
		description: string;
		id: string;
	};
	leftNavigateLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	loadingReactions: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	moreEmoji: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	otherUsers: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	popperWrapperLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	reactionsCount: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	reactWithEmoji: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	reactWithEmojiAndCount: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	rightNavigateLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	seeWhoReacted: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	seeWhoReactedTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	summary: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unexpectedError: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	addReaction: {
		id: 'fabric.reactions.add',
		defaultMessage: 'Add reaction',
		description:
			'Label for the add reaction button that opens the emoji picker for users to choose a reaction.',
	},
	addNewReaction: {
		id: 'fabric.reactions.add.new',
		defaultMessage: 'Add new',
		description: 'Message for add new reaction button in hoverable reaction picker',
	},
	loadingReactions: {
		id: 'fabric.reactions.loading',
		defaultMessage: 'Loading...',
		description: 'Message while reactions are being loaded',
	},
	moreEmoji: {
		id: 'fabric.reactions.more.emojis',
		defaultMessage: 'More emojis',
		description:
			'Tooltip of the "show more" button in the quick reaction selector. The full emoji selector is displayed when the user clicks on it.',
	},
	reactWithEmoji: {
		id: 'fabric.reactions.reactwithemoji',
		defaultMessage: 'React with {emoji} emoji',
		description:
			'Accessible aria-label for a reaction button. The placeholder {emoji} will be substituted with the emoji character name (e.g. thumbs up).',
	},
	reactWithEmojiAndCount: {
		id: 'fabric.reactions.reactwithemojiandcount',
		defaultMessage:
			'{count, plural, one {# {emoji} emoji} other {# {emoji} emojis}}. React with {emoji} emoji',
		description:
			'Accessible aria-label for a reaction button showing the current count. The placeholder {emoji} is the emoji name, and {count} is the number of reactions and controls the plural form.',
	},
	summary: {
		id: 'fabric.reactions.summary',
		defaultMessage:
			'View all user reactions, {count, plural, one {# reaction} other {# reactions}}',
		description:
			'Aria label on summary reaction button that includes the total count. Clicking this button shows who reacted in a popup',
	},
	unexpectedError: {
		id: 'fabric.reactions.error.unexpected',
		defaultMessage: 'Reactions are temporarily unavailable',
		description:
			'Error message shown in the reactions component when reactions fail to load or an unexpected error occurs.',
	},
	otherUsers: {
		id: 'fabric.reactions.other.reacted.users',
		defaultMessage: '{count, plural, one {and one other} other {and {count} others}}',
		description: "The number of users that have reacted similarly, but aren't shown",
	},
	closeReactionsDialog: {
		id: 'reactions.dialog.close',
		defaultMessage: 'Close',
		description:
			'Accessible label for the close button in the reactions detail dialog that dismisses it.',
	},
	reactionsCount: {
		id: 'reactions.dialog.reactions.count',
		defaultMessage: `{count, plural,
        one {# total reaction}
        other {# total reactions}
      }`,
		description: 'The count of Reactions displayed in Reactions Dialog',
	},
	leftNavigateLabel: {
		id: 'reactions.dialog.left.navigate',
		defaultMessage: 'Left Navigate',
		description:
			'Accessible label for the left navigation button in the reactions dialog that moves to the previous emoji tab.',
	},
	rightNavigateLabel: {
		id: 'reactions.dialog.right.navigate',
		defaultMessage: 'Right Navigate',
		description:
			'Accessible label for the right navigation button in the reactions dialog that moves to the next emoji tab.',
	},
	emojiName: {
		id: 'reactions.dialog.emoji.name',
		// eslint-disable-next-line @atlassian/i18n/no-useless-message
		defaultMessage: '{emojiName}',
		description:
			'Text shown as the emoji name tab label in the reactions dialog. The placeholder {emojiName} will be substituted with the emoji name (e.g. thumbs up).',
	},
	seeWhoReacted: {
		id: 'reactions.dialog.viewall',
		defaultMessage: 'View all',
		description: 'Link button to show who reacted in a modal',
	},
	seeWhoReactedTooltip: {
		id: 'reactions.dialog.viewall.tooltip',
		defaultMessage: 'View all user reactions',
		description:
			'Tooltip text shown when hovering over the link that opens the reactions detail dialog listing all users who reacted.',
	},
	popperWrapperLabel: {
		id: 'reactions-reaction.picker-label',
		defaultMessage: 'Add reactions',
		description:
			'Accessible aria-label for the reaction picker group container, used by screen readers to identify the group of reaction controls.',
	},
});
