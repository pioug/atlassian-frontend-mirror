import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	externalUserSourcesHeading: {
		id: 'smart-experiences.smart-hooks.external.sourced.from',
		defaultMessage: 'Found in:',
		description: 'From where the external user is coming',
	},
	slackProvider: {
		id: 'smart-experiences.smart-hooks.slack.provider',
		defaultMessage: 'Slack',
		description: 'This external user is sourced from Slack provider',
	},
	googleProvider: {
		id: 'smart-experiences.smart-hooks.google.provider',
		defaultMessage: 'Google',
		description: 'This external user is sourced from Google provider',
	},
	microsoftProvider: {
		id: 'smart-experiences.smart-hooks.microsoft.provider',
		defaultMessage: 'Microsoft',
		description: 'This external user is sourced from Microsoft provider',
	},
	gitHubProvider: {
		id: 'smart-experiences.smart-hooks.github.provider',
		defaultMessage: 'GitHub',
		description: 'This external user is sourced from GitHub provider',
	},
	memberLozengeText: {
		id: 'smart-experiences.smart-hooks.member.lozenge.text',
		defaultMessage: 'MEMBER',
		description: 'Text within the Lozenge when the user is a workspace member',
	},
	guestLozengeText: {
		id: 'smart-experiences.smart-hooks.guest.lozenge.text',
		defaultMessage: 'GUEST',
		description: 'Text within the lozenge when the user is a guest of confluence',
	},
	guestUserLozengeTooltip: {
		id: 'smart-experiences.smart-hooks.guest.lozenge.tooltip.user',
		defaultMessage: 'Guests can only access certain spaces and have limited access to user info.',
		description: 'Tooltip text for guest lozenge showing that a user is a guest in Confluence',
	},
	guestGroupLozengeTooltip: {
		id: 'smart-experiences.smart-hooks.guest.lozenge.tooltip.group',
		defaultMessage:
			'Guest groups can only access certain spaces and have limited access to user info.',
		description: 'Tooltip text for lozenge showing that a group is for guests in Confluence',
	},
});
