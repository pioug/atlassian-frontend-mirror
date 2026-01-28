import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	placeholder: {
		id: 'fabric.elements.user-picker.placeholder',
		defaultMessage: 'Enter people or teams...',
		description: 'Placeholder description for empty user/team/email select field.',
	},
	addMore: {
		id: 'fabric.elements.user-picker.placeholder.add-more',
		defaultMessage: 'add more people...',
		description: 'Placeholder for multi user picker when the field is not empty.',
	},
	remove: {
		id: 'fabric.elements.user-picker.multi.remove-item',
		defaultMessage: 'Remove',
		description: 'Tooltip for the single item remove button in a multi user select field.',
	},
	clear: {
		id: 'fabric.elements.user-picker.single.clear',
		defaultMessage: 'Clear',
		description: 'Tooltip for clear button in the single user select field.',
	},
	errorMessage: {
		id: 'fabric.elements.user-picker.error.message',
		defaultMessage: 'Something went wrong',
		description: 'Error message to display when options fail to load.',
	},
	teamByline: {
		id: 'fabric.elements.user-picker.team.byline',
		defaultMessage: 'Team',
		description: 'Byline for team',
	},
	officialTeamByline: {
		id: 'fabric.elements.user-picker.team.byline.official',
		defaultMessage: '{teamTypeName} {verifiedIcon}',
		description: 'Byline for official/verified team with dynamic team type name',
	},
	officialMemberCountWithoutYou: {
		id: 'fabric.elements.user-picker.team.member.count.official',
		defaultMessage:
			'{teamTypeName} {verifiedIcon} • {count} {count, plural, one {member} other {members}}',
		description:
			'Byline to show the number of members in the team when the current user is not a member of the team',
	},
	officialMemberCountWithYou: {
		id: 'fabric.elements.user-picker.team.member.count.official.including.you',
		defaultMessage:
			'{teamTypeName} {verifiedIcon} • {count} {count, plural, one {member} other {members}}, including you',
		description:
			'Byline to show the number of members in the team when the current user is also a member of the team',
	},
	memberCountWithoutYou: {
		id: 'fabric.elements.user-picker.team.member.count',
		defaultMessage: 'Team • {count} {count, plural, one {member} other {members}}',
		description:
			'Byline to show the number of members in the team when the current user is not a member of the team',
	},
	memberCountWithYou: {
		id: 'fabric.elements.user-picker.team.member.count.including.you',
		defaultMessage: 'Team • {count} {count, plural, one {member} other {members}}, including you',
		description:
			'Byline to show the number of members in the team when the current user is also a member of the team',
	},
	officialPlus50MembersWithoutYou: {
		id: 'fabric.elements.user-picker.team.member.50plus.official',
		defaultMessage: '{teamTypeName} {verifiedIcon} • 50+ members',
		description: 'Byline to show the number of members in the team when the number exceeds 50',
	},
	officialPlus50MembersWithYou: {
		id: 'fabric.elements.user-picker.team.member.50plus.official.including.you',
		defaultMessage: '{teamTypeName} {verifiedIcon} • 50+ members, including you',
		description:
			'Byline to show the number of members in the team when the number exceeds 50 and also includes the current user',
	},
	plus50MembersWithoutYou: {
		id: 'fabric.elements.user-picker.team.member.50plus',
		defaultMessage: 'Team • 50+ members',
		description: 'Byline to show the number of members in the team when the number exceeds 50',
	},
	plus50MembersWithYou: {
		id: 'fabric.elements.user-picker.team.member.50plus.including.you',
		defaultMessage: 'Team • 50+ members, including you',
		description:
			'Byline to show the number of members in the team when the number exceeds 50 and also includes the current user',
	},
	addEmail: {
		id: 'fabric.elements.user-picker.email.add',
		defaultMessage: 'Add user',
		description: 'Byline for valid email option.',
	},
	selectToAddEmail: {
		id: 'fabric.elements.user-picker.email.select.to.add',
		defaultMessage: 'Select an email address',
		description: 'Byline for valid email option.',
	},
	continueToAddEmail: {
		id: 'fabric.elements.user-picker.email.add.potential',
		defaultMessage: 'Enter an email address',
		description: 'Byline for a potentially valid email option.',
	},
	adminManagedGroupByline: {
		id: 'fabric.elements.user-picker.group.byline.admin-managed',
		defaultMessage: 'Admin group {verifiedIcon}',
		description: 'Byline for admin-managed groups with verified icon',
	},
	groupByline: {
		id: 'fabric.elements.user-picker.group.byline',
		defaultMessage: 'Admin-managed group',
		description: 'Byline for admin-managed groups',
	},
	externalUserSourcesHeading: {
		id: 'fabric.elements.user-picker.external.sourced.from',
		defaultMessage: 'Found in:',
		description: 'From where the external user is coming',
	},
	externalUserSourcesError: {
		id: 'fabric.elements.user-picker.external.sourced.error',
		defaultMessage: "We can't connect you right now.",
		description: "Error message when we can't fetch a user's import sources",
	},
	slackProvider: {
		id: 'fabric.elements.user-picker.slack.provider',
		defaultMessage: 'Slack',
		description: 'This external user is sourced from Slack provider',
	},
	googleProvider: {
		id: 'fabric.elements.user-picker.google.provider',
		defaultMessage: 'Google',
		description: 'This external user is sourced from Google provider',
	},
	microsoftProvider: {
		id: 'fabric.elements.user-picker.microsoft.provider',
		defaultMessage: 'Microsoft',
		description: 'This external user is sourced from Microsoft provider',
	},
	gitHubProvider: {
		id: 'fabric.elements.user-picker.github.provider',
		defaultMessage: 'GitHub',
		description: 'This external user is sourced from GitHub provider',
	},
	jiraSource: {
		id: 'fabric.elements.user-picker.source.jira',
		defaultMessage: 'Jira',
		description: 'This external user is sourced from Jira',
	},
	confluenceSource: {
		id: 'fabric.elements.user-picker.source.confluence',
		defaultMessage: 'Confluence',
		description: 'This external user is sourced from Confluence',
	},
	otherAtlassianSource: {
		id: 'fabric.elements.user-picker.source.other-atlassian',
		defaultMessage: 'Other Atlassian products',
		description:
			'This external user is sourced from Atlassian products other than Jira and Confluence',
	},
	otherAtlassianSourceAppify: {
		id: 'fabric.elements.user-picker.source.other-atlassian-appify',
		defaultMessage: 'Other Atlassian apps',
		description:
			'This external user is sourced from Atlassian products other than Jira and Confluence',
	},
	memberLozengeText: {
		id: 'fabric.elements.user-picker.member.lozenge.text',
		defaultMessage: 'MEMBER',
		description: 'Text within the Lozenge when the user is a workspace member',
	},
	guestLozengeText: {
		id: 'fabric.elements.user-picker.guest.lozenge.text',
		defaultMessage: 'GUEST',
		description: 'Text within the lozenge when the user is a guest of confluence',
	},
	guestUserLozengeTooltip: {
		id: 'fabric.elements.user-picker.guest.lozenge.tooltip.user',
		defaultMessage: 'Guests can only access certain spaces and have limited access to user info.',
		description: 'Tooltip text for guest lozenge showing that a user is a guest in Confluence',
	},
	guestGroupLozengeTooltip: {
		id: 'fabric.elements.user-picker.guest.lozenge.tooltip.group',
		defaultMessage:
			'Guest groups can only access certain spaces and have limited access to user info.',
		description: 'Tooltip text for lozenge showing that a group is for guests in Confluence',
	},
	userTypeLabel: {
		id: 'fabric.elements.user-picker.user.type.label',
		defaultMessage: 'People',
		description: 'Label for user type',
	},
	teamTypeLabel: {
		id: 'fabric.elements.user-picker.team.type.label',
		defaultMessage: 'Teams',
		description: 'Label for team type',
	},
	emailTypeLabel: {
		id: 'fabric.elements.user-picker.email.type.label',
		defaultMessage: 'Emails',
		description: 'Label for email type',
	},
	groupTypeLabel: {
		id: 'fabric.elements.user-picker.group.type.label',
		defaultMessage: 'Groups',
		description: 'Label for group type',
	},
	externalUserTypeLabel: {
		id: 'fabric.elements.user-picker.external.user.type.label',
		defaultMessage: 'External Users',
		description: 'Label for external user type',
	},
	customTypeLabel: {
		id: 'fabric.elements.user-picker.custom.type.label',
		defaultMessage: 'Customs',
		description: 'Label for custom type',
	},
	otherTypeLabel: {
		id: 'fabric.elements.user-picker.other.type.label',
		defaultMessage: 'Others',
		description: 'Label for other type',
	},
});
