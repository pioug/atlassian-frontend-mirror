import { defineMessages } from 'react-intl-next';

const messages: {
    giveKudosButton: {
        id: string;
        defaultMessage: string;
        description: string;
    }; kudosCreatedFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; kudosCreatedDescriptionFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; kudosCreatedActionFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; kudosCreationFailedFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; kudosCreationFailedDescriptionFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; JiraKudosCreatedFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; JiraKudosCreatedDescriptionFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; JiraKudosCreationFailedFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; JiraKudosCreationFailedDescriptionFlag: {
        id: string;
        defaultMessage: string;
        description: string;
    }; unsavedKudosWarning: {
        id: string;
        defaultMessage: string;
        description: string;
    }; unsavedKudosWarningCancelButton: {
        id: string;
        defaultMessage: string;
        description: string;
    }; unsavedKudosWarningCloseButton: {
        id: string;
        defaultMessage: string;
        description: string;
    }; confirmCloseTitle: {
        id: string;
        defaultMessage: string;
        description: string;
    }; closeDrawerButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; successIconLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorIconLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	giveKudosButton: {
		id: 'team-central.give-kudos.button',
		defaultMessage: 'Give kudos',
		description: 'Label for the button that opens the give kudos creation form',
	},
	kudosCreatedFlag: {
		id: 'team-central.give-kudos.created.title.flag',
		defaultMessage: 'Kudos has been created',
		description: 'Title text displayed in the success notification after kudos creation',
	},
	kudosCreatedDescriptionFlag: {
		id: 'team-central.give-kudos.created.description.flag',
		defaultMessage: 'Your kudos has been sent. <a>View kudos</a>',
		description:
			'Description text displayed in the success notification with a link to view the newly created kudos',
	},
	kudosCreatedActionFlag: {
		id: 'team-central.give-kudos.created.action.flag',
		defaultMessage: 'View kudos',
		description: 'Action button label in the success notification to view the newly created kudos',
	},
	kudosCreationFailedFlag: {
		id: 'team-central.give-kudos.creation.failed.title.flag',
		defaultMessage: 'Something went wrong',
		description: 'Title text displayed in the error notification when kudos creation fails',
	},
	kudosCreationFailedDescriptionFlag: {
		id: 'team-central.give-kudos.creation.failed.description.flag',
		defaultMessage: "We couldn't create your kudos.",
		description: 'Description text displayed in the error notification when kudos creation fails',
	},
	JiraKudosCreatedFlag: {
		id: 'team-central.give-jira-kudos.created.title.flag',
		defaultMessage: 'Kudos created',
		description: 'Title text displayed in the success notification after Jira kudos creation',
	},
	JiraKudosCreatedDescriptionFlag: {
		id: 'team-central.give-jira-kudos.created.description.flag',
		defaultMessage:
			'Our Workplace Experience team will now work their magic for the gift request. ✨',
		description:
			'Description text displayed in the success notification after Jira kudos creation with information about the gift request processing',
	},
	JiraKudosCreationFailedFlag: {
		id: 'team-central.give-jira-kudos.creation.failed.title.flag',
		defaultMessage: 'Something went wrong',
		description: 'Title text displayed in the error notification when Jira kudos creation fails',
	},
	JiraKudosCreationFailedDescriptionFlag: {
		id: 'team-central.give-jira-kudos.creation.failed.description.flag',
		defaultMessage:
			"We couldn't create your kudos or send the gift. Try raising a separate ticket at <a>go/kudos</a>..",
		description:
			'Description text displayed in the error notification when Jira kudos creation fails, with a link to the kudos form',
	},
	unsavedKudosWarning: {
		id: 'team-central.give-kudos.unsaved.warning',
		defaultMessage: 'Changes that you made will not be saved.',
		description:
			'Warning message displayed when the user attempts to close the kudos creation form with unsaved changes',
	},
	unsavedKudosWarningCancelButton: {
		id: 'team-central.give-kudos.unsaved.warning.cancel',
		defaultMessage: 'Cancel',
		description:
			'Button label that cancels the close action and returns to the kudos creation form',
	},
	unsavedKudosWarningCloseButton: {
		id: 'team-central.give-kudos.unsaved.warning.close',
		defaultMessage: 'Close',
		description: 'Button label that confirms closing and dismisses the kudos creation drawer',
	},
	confirmCloseTitle: {
		id: 'team-central.give-kudos.confirm-close.title',
		defaultMessage: 'Confirm Close',
		description: 'Title text displayed in the modal confirming drawer closure',
	},
	closeDrawerButtonLabel: {
		id: 'team-central.give-kudos.close-button.label',
		defaultMessage: 'Close drawer',
		description: 'Label for the button that closes the kudos creation drawer',
	},
	successIconLabel: {
		id: 'team-central.give-kudos.success-icon.label',
		defaultMessage: 'Success',
		description: 'Accessibility label for the success status icon',
	},
	errorIconLabel: {
		id: 'team-central.give-kudos.error-icon.label',
		defaultMessage: 'Error',
		description: 'Accessibility label for the error status icon',
	},
});
export default messages;
