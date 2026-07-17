import { defineMessages } from 'react-intl';

export const messages: {
	defaultAdvisedAction: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	defaultHeadline: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	differentText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	loadingPlaceholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	loginAgain: {
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
	noAccessLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noAccessWarning: {
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
	unknownUserError: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	xProductMentionDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	unknownUserError: {
		id: 'fabric.mention.unknow.user.error',
		defaultMessage: 'Unknown user {userId}',
		description: 'Mention user name could not be found or look up failed',
	},
	noAccessWarning: {
		id: 'fabric.mention.noAccess.warning',
		defaultMessage: "{name} won't be notified as they have no access",
		description: "Warning message to show that the mentioned user won't be notified",
	},
	noAccessLabel: {
		id: 'fabric.mention.noAccess.label',
		defaultMessage: 'No access',
		description:
			'Accessible label shown next to the no-access icon on a mention, indicating the mentioned user does not have access to the current content.',
	},
	defaultHeadline: {
		id: 'fabric.mention.error.defaultHeadline',
		defaultMessage: 'Something went wrong',
		description: 'Error message shown when there is an error communicating with backend',
	},
	defaultAdvisedAction: {
		id: 'fabric.mention.error.defaultAction',
		defaultMessage: 'Try again in a few seconds',
		description: 'Default advised action when an error occurs',
	},
	loginAgain: {
		id: 'fabric.mention.error.loginAgain',
		defaultMessage: 'Try logging out then in again',
		description: 'Login again message when there is an authentication error occurs',
	},
	differentText: {
		id: 'fabric.mention.error.differentText',
		defaultMessage: 'Try entering different text',
		description: 'Enter different text message when a forbidden error occurs',
	},
	memberCountWithoutYou: {
		id: 'fabric.elements.mentions.team.member.count',
		defaultMessage: 'Team • {0, plural, one {1 member} other {{0} members}}',
		description:
			'Byline to show the number of members in the team when the current user is not a member of the team',
	},
	memberCountWithYou: {
		id: 'fabric.elements.mentions.team.member.count.including.you',
		defaultMessage: 'Team • {0, plural, one {1 member} other {{0} members}}, including you',
		description:
			'Byline to show the number of members in the team when the current user is also a member of the team',
	},
	plus50MembersWithoutYou: {
		id: 'fabric.elements.mentions.team.member.50plus',
		defaultMessage: 'Team • 50+ members',
		description: 'Byline to show the number of members in the team when the number exceeds 50',
	},
	plus50MembersWithYou: {
		id: 'fabric.elements.mentions.team.member.50plus.including.you',
		defaultMessage: 'Team • 50+ members, including you',
		description:
			'Byline to show the number of members in the team when the number exceeds 50 and also includes the current user',
	},
	xProductMentionDescription: {
		id: 'fabric.elements.mentions.xproduct.mention.description',
		defaultMessage: 'Needs access to Confluence',
		description: 'Description for a x-product mention item in the mention list in Confluence',
	},
	loadingPlaceholder: {
		id: 'fabric.elements.mentions.loading.placeholder',
		defaultMessage: 'Loading',
		description:
			'Accessible label for a loading placeholder row shown in the mention list while a slower mention source (such as agents) is still loading.',
	},
});
