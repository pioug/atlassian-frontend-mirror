import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	addReaction: {
		id: 'fabric.reactions.add',
		defaultMessage: 'Add reaction',
		description: 'Message for add reaction button',
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
	moreInfo: {
		id: 'fabric.reactions.more.info',
		defaultMessage: 'More info',
		description:
			'Clickable text in a tooltip that will display more information about the users who reacted',
	},
	reactWithEmoji: {
		id: 'fabric.reactions.reactwithemoji',
		defaultMessage: 'React with {emoji} emoji',
		description: 'Aria label on reaction button',
	},
	summary: {
		id: 'fabric.reactions.summary',
		defaultMessage: 'View all user reactions',
		description:
			'Aria label on summary reaction button. Clicking this button shows who reacted in a popup',
	},
	unexpectedError: {
		id: 'fabric.reactions.error.unexpected',
		defaultMessage: 'Reactions are temporarily unavailable',
		description: 'Unexpected error message',
	},
	otherUsers: {
		id: 'fabric.reactions.other.reacted.users',
		defaultMessage: '{count, plural, one {and one other} other {and {count} others}}',
		description: "The number of users that have reacted similarly, but aren't shown",
	},
	closeReactionsDialog: {
		id: 'reactions.dialog.close',
		defaultMessage: 'Close',
		description: 'Close Reactions Dialog',
	},
	reactionsCount: {
		id: 'reactions.dialog.reactions.count',
		defaultMessage: `{count, plural,
        one {# reaction}
        other {# reactions}
      }`,
		description: 'The count of Reactions displayed in Reactions Dialog',
	},
	leftNavigateLabel: {
		id: 'reactions.dialog.left.navigate',
		defaultMessage: 'Left Navigate',
		description: 'Navigation Link to navigate to left',
	},
	rightNavigateLabel: {
		id: 'reactions.dialog.right.navigate',
		defaultMessage: 'Right Navigate',
		description: 'Navigation Link to navigate to right',
	},
	emojiName: {
		id: 'reactions.dialog.emoji.name',
		defaultMessage: '{emojiName}',
		description: 'Description of the emoji',
	},
	seeWhoReacted: {
		id: 'reactions.dialog.viewall',
		defaultMessage: 'See who reacted',
		description: 'Link button to show who reacted in a modal',
	},
	seeWhoReactedTooltip: {
		id: 'reactions.dialog.viewall.tooltip',
		defaultMessage: 'View all user reactions',
		description: 'Tooltip content of see who reacted link',
	},
});
