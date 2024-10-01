import { defineMessages } from 'react-intl-next';

const messages = defineMessages({
	giveKudosButton: {
		id: 'team-central.give-kudos.button',
		defaultMessage: 'Give kudos',
		description: 'Title for the button to give a kudos',
	},
	kudosCreatedFlag: {
		id: 'team-central.give-kudos.created.title.flag',
		defaultMessage: 'Kudos created',
		description: 'Title text for kudos creation flag.',
	},
	kudosCreatedDescriptionFlag: {
		id: 'team-central.give-kudos.created.description.flag',
		defaultMessage: 'Your kudos has been sent. <a>View kudos</a>',
		description:
			'Description text for the kudos created flag. This includes a link to view the newly created kudos.',
	},
	kudosCreationFailedFlag: {
		id: 'team-central.give-kudos.creation.failed.title.flag',
		defaultMessage: 'Something went wrong',
		description: 'Title text for kudos creation failed flag.',
	},
	kudosCreationFailedDescriptionFlag: {
		id: 'team-central.give-kudos.creation.failed.description.flag',
		defaultMessage: "We couldn't create your kudos.",
		description: 'Description text for the kudos creation failed flag.',
	},
	JiraKudosCreatedFlag: {
		id: 'team-central.give-jira-kudos.created.title.flag',
		defaultMessage: 'Kudos created',
		description: 'Title text for kudos creation flag.',
	},
	JiraKudosCreatedDescriptionFlag: {
		id: 'team-central.give-jira-kudos.created.description.flag',
		defaultMessage:
			'Our Workplace Experience team will now work their magic for the gift request. ✨',
		description:
			'Description text for the atlas and jira kudos created flag. This includes links to view the newly created kudos and jira kudos request.',
	},
	JiraKudosCreationFailedFlag: {
		id: 'team-central.give-jira-kudos.creation.failed.title.flag',
		defaultMessage: 'Something went wrong',
		description: 'Title text for jira kudos creation failed flag.',
	},
	JiraKudosCreationFailedDescriptionFlag: {
		id: 'team-central.give-jira-kudos.creation.failed.description.flag',
		defaultMessage:
			"We couldn't create your kudos or send the gift. Try raising a separate ticket at <a>go/kudos</a>..",
		description:
			'Description text for the jira kudos creation failed flag. This includes a link to the jira kudos form.',
	},
	unsavedKudosWarning: {
		id: 'team-central.give-kudos.unsaved.warning',
		defaultMessage: 'Changes that you made will not be saved.',
		description:
			'Shown when the user tries to navigate away from the kudos creation screen with unsaved changes.',
	},
	unsavedKudosWarningCancelButton: {
		id: 'team-central.give-kudos.unsaved.warning.cancel',
		defaultMessage: 'Cancel',
		description: 'Button that cancels closing the create kudos drawer.',
	},
	unsavedKudosWarningCloseButton: {
		id: 'team-central.give-kudos.unsaved.warning.close',
		defaultMessage: 'Close',
		description: 'Button that closes the warning modal and closes the drawer.',
	},
	confirmCloseTitle: {
		defaultMessage: 'Confirm Close',
		description: 'Close kudos drawer confirmation modal title',
		id: 'team-central.give-kudos.confirm-close.title',
	},
	closeDrawerButtonLabel: {
		defaultMessage: 'Close drawer',
		description: 'Close kudos drawer button label',
		id: 'team-central.give-kudos.close-button.label',
	},
	successIconLabel: {
		defaultMessage: 'Success',
		description: 'Success icon label',
		id: 'team-central.give-kudos.success-icon.label',
	},
});

export default messages;
