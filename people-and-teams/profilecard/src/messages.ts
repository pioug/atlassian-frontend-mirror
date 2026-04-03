import { defineMessages } from 'react-intl-next';

const messages: {
    inactiveAccountMsg: {
        id: string;
        defaultMessage: string;
        description: string;
    }; generalDescMsgForDisabledUser: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgNoDate: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgHasDateThisWeek: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgHasDateThisMonth: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgHasDateLastMonth: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgHasDateAFewMonths: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgHasDateSeveralMonths: {
        id: string;
        defaultMessage: string;
        description: string;
    }; inactiveAccountDescMsgHasDateMoreThanAYear: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountMsg: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgNoDate: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgHasDateThisWeek: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgHasDateThisMonth: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgHasDateLastMonth: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgHasDateAFewMonths: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgHasDateSeveralMonths: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closedAccountDescMsgHasDateMoreThanAYear: {
        id: string;
        defaultMessage: string;
        description: string;
    }; disabledAccountDefaultName: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamViewProfile: {
        id: string;
        defaultMessage: string;
        description: string;
    }; memberCount: {
        id: string;
        defaultMessage: string;
        description: string;
    }; memberCountIncludingYou: {
        id: string;
        defaultMessage: string;
        description: string;
    }; membersMoreThan50: {
        id: string;
        defaultMessage: string;
        description: string;
    }; membersMoreThan50IncludingYou: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamErrorTitle: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamErrorText: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamErrorButton: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamForbiddenErrorStateTitle: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamForbiddenErrorStateDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; managerSectionHeading: {
        id: string;
        defaultMessage: string;
        description: string;
    }; directReportsSectionHeading: {
        id: string;
        defaultMessage: string;
        description: string;
    }; teamProfileCardAriaLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; giveKudosButton: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    // Remove this as part of the FG Cleanup for jfp_a11y_team_profile_card_actions_label
    profileCardMoreIconLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; profileCardMoreIconLabelWithName: {
        id: string;
        defaultMessage: string;
        description: string;
    }; profileCardMoreReportingLinesLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; profileCardMoreMembersLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; archivedLozenge: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorUserNotFound: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorGeneric: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorRetrySuggestion: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorTryAgain: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorDialogLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; loadingDialogLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; serviceAccountLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; botAccountLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; viewManagerProfile: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	inactiveAccountMsg: {
		id: 'pt.profile-card.inactive.account',
		defaultMessage: 'Account deactivated',
		description: 'A text in a grey lozenge shows that this user is inactive',
	},

	generalDescMsgForDisabledUser: {
		id: 'pt.profile-card.general.msg.disabled.user',
		defaultMessage: 'You can no longer collaborate with this person.',
		description: 'A first sentence of a long text explains this user is inactive/closed',
	},

	inactiveAccountDescMsgNoDate: {
		id: 'pt.profile-card.inactive.account.no.date',
		defaultMessage: 'Their account has been deactivated.',
		description:
			'A long text explains this user is inactive when we do not know the date of starting to deactivate',
	},

	inactiveAccountDescMsgHasDateThisWeek: {
		id: 'pt.profile-card.inactive.account.has.date.this.week',
		defaultMessage: 'Their account was deactivated this week.',
		description:
			'A long text explains this user is inactive when we know the date of starting to deactivate',
	},

	inactiveAccountDescMsgHasDateThisMonth: {
		id: 'pt.profile-card.inactive.account.has.date.this.month',
		defaultMessage: 'Their account was deactivated this month.',
		description:
			'A long text explains this user is inactive when we know the date of starting to deactivate',
	},

	inactiveAccountDescMsgHasDateLastMonth: {
		id: 'pt.profile-card.inactive.account.has.date.last.month',
		defaultMessage: 'Their account was deactivated last month.',
		description:
			'A long text explains this user is inactive when we know the date of starting to deactivate',
	},

	inactiveAccountDescMsgHasDateAFewMonths: {
		id: 'pt.profile-card.inactive.account.has.date.a.few.months',
		defaultMessage: 'Their account has been deactivated for a few months.',
		description:
			'A long text explains this user is inactive when we know the date of starting to deactivate',
	},

	inactiveAccountDescMsgHasDateSeveralMonths: {
		id: 'pt.profile-card.inactive.account.has.date.several.months',
		defaultMessage: 'Their account has been deactivated for several months.',
		description:
			'A long text explains this user is inactive when we know the date of starting to deactivate',
	},

	inactiveAccountDescMsgHasDateMoreThanAYear: {
		id: 'pt.profile-card.inactive.account.has.date.more.than.a.year',
		defaultMessage: 'Their account has been deactivated for more than a year.',
		description:
			'A long text explains this user is inactive when we know the date of starting to deactivate',
	},

	closedAccountMsg: {
		id: 'pt.profile-card.closed.account',
		defaultMessage: 'Account deleted',
		description: 'A text in a grey lozenge shows that this user is closed/deleted',
	},

	closedAccountDescMsgNoDate: {
		id: 'pt.profile-card.closed.account.no.date',
		defaultMessage: 'Their account has been deleted.',
		description:
			'A long text explains this user is closed when we do not know the date of starting to close',
	},

	closedAccountDescMsgHasDateThisWeek: {
		id: 'pt.profile-card.closed.account.has.date.this.week',
		defaultMessage: 'Their account was deleted this week.',
		description:
			'A long text explains this user is closed when we know the date of starting to close',
	},

	closedAccountDescMsgHasDateThisMonth: {
		id: 'pt.profile-card.closed.account.has.date.this.month',
		defaultMessage: 'Their account was deleted this month.',
		description:
			'A long text explains this user is closed when we know the date of starting to close',
	},

	closedAccountDescMsgHasDateLastMonth: {
		id: 'pt.profile-card.closed.account.has.date.last.month',
		defaultMessage: 'Their account was deleted last month.',
		description:
			'A long text explains this user is closed when we know the date of starting to close',
	},

	closedAccountDescMsgHasDateAFewMonths: {
		id: 'pt.profile-card.closed.account.has.date.a.few.months',
		defaultMessage: 'Their account has been deleted for a few months.',
		description:
			'A long text explains this user is closed when we know the date of starting to close',
	},

	closedAccountDescMsgHasDateSeveralMonths: {
		id: 'pt.profile-card.closed.account.has.date.several.months',
		defaultMessage: 'Their account has been deleted for several months.',
		description:
			'A long text explains this user is closed when we know the date of starting to close',
	},

	closedAccountDescMsgHasDateMoreThanAYear: {
		id: 'pt.profile-card.closed.account.has.date.more.than.a.year',
		defaultMessage: 'Their account has been deleted for more than a year.',
		description:
			'A long text explains this user is closed when we know the date of starting to close',
	},

	disabledAccountDefaultName: {
		id: 'pt.profile-card.disabled.account.default.name',
		defaultMessage: 'Former user',
		description: 'A default name when we cannot get name of an inactive or closed user',
	},
	teamViewProfile: {
		id: 'pt.team-profile-card.team.action.view-profile',
		defaultMessage: 'View profile',
		description: 'Button that takes you to view this team’s profile',
	},
	memberCount: {
		id: 'pt.team-profile-card.team.member.count',
		defaultMessage: 'Team • {count} {count, plural, one {member} other {members}}',
		description: 'Byline to show the number of members in the team',
	},
	memberCountIncludingYou: {
		id: 'pt.team-profile-card.team.member.count-including-you',
		defaultMessage: 'Team • {count} {count, plural, one {member} other {members}}, including you',
		description:
			'Byline to show the number of members in the team and highlight that the user is a member',
	},
	membersMoreThan50: {
		id: 'pt.team-profile-card.team.member.many',
		defaultMessage: 'Team • 50+ members',
		description: 'Byline to show the team has more than 50 members',
	},
	membersMoreThan50IncludingYou: {
		id: 'pt.team-profile-card.team.member.many-including-you',
		defaultMessage: 'Team • 50+ members, including you',
		description:
			'Byline to show the team has more than 50 members and highlight that the user is a member',
	},
	teamErrorTitle: {
		id: 'pt.team-profile-card.error.title',
		defaultMessage: 'We’re having trouble retrieving this teams information',
		description: 'Title for an error view explaining that data for this team cannot be accessed',
	},
	teamErrorText: {
		id: 'pt.team-profile-card.error.suggestion',
		defaultMessage: 'Wait a few moments, then try again.',
		description: 'Second line suggesting how to fix the issue',
	},
	teamErrorButton: {
		id: 'pt.team-profile-card.error.refresh-button',
		defaultMessage: 'Try again',
		description: 'Text on a button that will try to get the data again when clicked',
	},
	teamForbiddenErrorStateTitle: {
		id: 'pt.team-profile-card.forbidden-error-state.title',
		defaultMessage: 'We can’t show you this team',
		description: 'Title for the error state that is displayed when a user lacks access to the team',
	},
	teamForbiddenErrorStateDescription: {
		id: 'pt.team-profile-card.forbidden-error-state.description',
		defaultMessage: 'You don’t have access to view this team.',
		description:
			'Description for the error state that is displayed when a user lacks access to the team',
	},
	managerSectionHeading: {
		id: 'pt.team-profile-card.manager.heading',
		defaultMessage: 'Manager',
		description: "Title for a section on the profile card that show the user's direct manager",
	},
	directReportsSectionHeading: {
		id: 'pt.team-profile-card.directReports.heading',
		defaultMessage: 'Direct reports',
		description: "Title for a section on the profile card that show the user's direct reports",
	},
	teamProfileCardAriaLabel: {
		id: 'pt.team-profile-card.aria-label',
		defaultMessage: 'More information about this team',
		description: 'Aria label for the team profile card',
	},
	giveKudosButton: {
		id: 'pt.profile-card.give-kudos',
		defaultMessage: 'Give kudos',
		description: 'Title for the button on the profile card for a user to give a kudos',
	},
	// Remove this as part of the FG Cleanup for jfp_a11y_team_profile_card_actions_label
	profileCardMoreIconLabel: {
		id: 'pt.profile-card.more-icon-label',
		defaultMessage: 'More',
		description:
			'Label for the meatballs icon on the profile card, which when clicked will provide more options',
	},
	profileCardMoreIconLabelWithName: {
		id: 'pt.profile-card.more-icon-label-with-name',
		defaultMessage: 'More actions for {fullName}',
		description:
			'Label for the meatballs icon on the profile card, which when clicked will provide more options',
	},
	profileCardMoreReportingLinesLabel: {
		id: 'pt.user-profile-card.reporting-lines.more-icon-label',
		defaultMessage: '+{count} more {count, plural, one {profile} other {profiles}}',
		description:
			'Label for the "more profiles" indicator in the reporting lines section of the user profile card',
	},
	profileCardMoreMembersLabel: {
		id: 'pt.team.profile-card.members.more-icon-label',
		defaultMessage: '+{count} more {count, plural, one {members} other {members}}',
		description:
			'Label for the "more members" indicator in the members section of the team profile card',
	},
	archivedLozenge: {
		id: 'pt.team-profile-card.archived-lozenge',
		defaultMessage: 'Archived',
		description: 'Lozenge to indicate that a team is archived',
	},
	errorUserNotFound: {
		id: 'pt.profile-card.error.user-not-found',
		defaultMessage: 'The user is no longer available for the site',
		description: 'Error message shown when the user is not found',
	},
	errorGeneric: {
		id: 'pt.profile-card.error.generic',
		defaultMessage: 'Oops, looks like we’re having issues',
		description: 'Generic error message shown when there is an issue loading the profile card',
	},
	errorRetrySuggestion: {
		id: 'pt.profile-card.error.retry-suggestion',
		defaultMessage: 'Try again and we’ll give it another shot',
		description: 'Suggestion message shown to the user to retry loading the profile card',
	},
	errorTryAgain: {
		id: 'pt.profile-card.error.try-again-button',
		defaultMessage: 'Try again',
		description: 'Label for the button to retry loading the profile card after an error',
	},
	errorDialogLabel: {
		id: 'pt.profile-card.error.dialog-label',
		defaultMessage: 'Profile card error',
		description: 'Accessible label for the profile card dialog when in error state',
	},
	loadingDialogLabel: {
		id: 'pt.profile-card.loading.dialog-label',
		defaultMessage: 'Loading profile card',
		description: 'Accessible label for the profile card dialog when loading',
	},
	serviceAccountLabel: {
		id: 'pt.profile-card.service-account.label',
		defaultMessage: 'SERVICE ACCOUNT',
		description: 'Label to indicate that the user is a service account',
	},
	botAccountLabel: {
		id: 'pt.profile-card.bot-account.label',
		defaultMessage: 'APP',
		description: 'Label to indicate that the user is a bot account',
	},
	viewManagerProfile: {
		id: 'pt.profile-card.view-manager-profile',
		defaultMessage: 'View {name} profile',
		description: "Accessible label for the button to view the manager's profile",
	},
});

export default messages;
