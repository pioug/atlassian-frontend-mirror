import { defineMessages } from 'react-intl';

export const messages: {
	addEmail: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	addMore: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	adminManagedGroupByline: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	archivedLozenge: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	clear: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confluenceSource: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	continueToAddEmail: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	customTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emailTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	errorMessage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	externalUserSourcesError: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	externalUserSourcesHeading: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	externalUserTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	gitHubProvider: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	googleProvider: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	groupByline: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	groupTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	guestGroupLozengeTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	guestLozengeText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	guestUserLozengeTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	jiraSource: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	memberCountWithoutYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	memberCountWithYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	memberLozengeText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	microsoftProvider: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	officialMemberCountWithoutYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	officialMemberCountWithYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	officialPlus50MembersWithoutYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	officialPlus50MembersWithYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	officialTeamByline: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	otherAtlassianSource: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	otherAtlassianSourceAppify: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	otherTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	placeholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	plus50MembersWithoutYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	plus50MembersWithYou: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	remove: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	selectToAddEmail: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	slackProvider: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	teamByline: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	teamTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	userTypeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
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
		description:
			'Secondary text shown below a team name in the user picker drop-down list to indicate the option is a team.',
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
		description:
			'Label for the add-user option shown in the user picker when the user has typed a valid email address.',
	},
	selectToAddEmail: {
		id: 'fabric.elements.user-picker.email.select.to.add',
		defaultMessage: 'Select an email address',
		description:
			'Instruction text shown in the user picker prompting the user to select a typed email address to add it.',
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
		description:
			'Secondary text shown below a group name in the user picker drop-down list to indicate the option is an admin-managed group.',
	},
	externalUserSourcesHeading: {
		id: 'fabric.elements.user-picker.external.sourced.from',
		defaultMessage: 'Found in:',
		description:
			'Label shown in the user picker beside the list of sources where an external user was found (e.g. Jira, Confluence).',
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
		description:
			'Source label shown in the user picker to indicate that an external user was found via Jira.',
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
	archivedLozenge: {
		id: 'fabric.elements.user-picker.archived.lozenge.text',
		defaultMessage: 'Archived',
		description: 'Text within the lozenge when the selected team has been archived/disbanded',
	},
	userTypeLabel: {
		id: 'fabric.elements.user-picker.user.type.label',
		defaultMessage: 'People',
		description:
			'Tab or section heading label in the user picker that groups results of type People (individual users).',
	},
	teamTypeLabel: {
		id: 'fabric.elements.user-picker.team.type.label',
		defaultMessage: 'Teams',
		description:
			'Tab or section heading label in the user picker that groups results of type Teams.',
	},
	emailTypeLabel: {
		id: 'fabric.elements.user-picker.email.type.label',
		defaultMessage: 'Emails',
		description:
			'Tab or section heading label in the user picker that groups results of type Emails.',
	},
	groupTypeLabel: {
		id: 'fabric.elements.user-picker.group.type.label',
		defaultMessage: 'Groups',
		description:
			'Tab or section heading label in the user picker that groups results of type Groups.',
	},
	externalUserTypeLabel: {
		id: 'fabric.elements.user-picker.external.user.type.label',
		defaultMessage: 'External Users',
		description:
			'Tab or section heading label in the user picker that groups results of type External Users.',
	},
	customTypeLabel: {
		id: 'fabric.elements.user-picker.custom.type.label',
		defaultMessage: 'Customs',
		description:
			'Tab or section heading label in the user picker that groups results of a custom type defined by the host application.',
	},
	otherTypeLabel: {
		id: 'fabric.elements.user-picker.other.type.label',
		defaultMessage: 'Others',
		description:
			'Tab or section heading label in the user picker that groups results that do not fit any standard type category.',
	},
});
