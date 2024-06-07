const messages = {
	successFlag: {
		id: 'automation-platform.common.success-flag',
		defaultMessage: 'Your automation is in progress',
		description: 'Text for a success flag when an automation rule has been triggered',
	},
	failureFlagTitle: {
		id: 'automation-platform.common.failure-flag-title',
		defaultMessage: 'Oops we ran into a problem',
		description: 'Title for an error flag when an automation rule failed to be triggered',
	},
	failureFlagDescription: {
		id: 'automation-platform.common.failure-flag-description',
		defaultMessage: "There was a problem and we couldn't run the automation '{0}'",
		description: 'Description for an error flag when an automation rule failed to be triggered',
	},
	partialFailureFlagDescription: {
		id: 'automation-platform.common.partial-failure-flag-description',
		defaultMessage:
			"Couldn't run the automation against issues {0}, please ensure you have permission to view these issues",
		description:
			'Description for an error flag when some issues failed to invoke because user does not have view permission',
	},
	errorInputMustNotBeEmpty: {
		id: 'automation-platform.common.error-input-must-not-be-empty',
		defaultMessage: 'Input must not be empty',
		description: 'The error message to show the value of a required field is empty',
	},
	errorInputCharacterLimitReached: {
		id: 'automation-platform.common.error-input-character-limit-reached',
		defaultMessage: 'Provided value exceeds the character limit for the field.',
		description:
			'The error message to show that the character limit has been reached for the field',
	},
	inputRequiredForAction: {
		id: 'automation-platform.common.input-required-for-action',
		defaultMessage: 'Your input is required to complete this action',
		description: 'The title of the modal for user inputs',
	},
	errorInputTypeIsNotSupported: {
		id: 'automation-platform.common.error-input-type-is-not-supported',
		defaultMessage: 'Input type not supported yet',
		description: 'The error message to show when the type of user input is not recognised',
	},
	errorValueIsNotValidNumber: {
		id: 'automation-platform.common.error-value-is-not-valid-number',
		defaultMessage: 'The value is not a valid number',
		description:
			'The error message for when the type of user input is number but the value is not a valid number',
	},
	cancelButtonTitle: {
		id: 'automation-platform.common.cancel-button-title',
		defaultMessage: 'Cancel',
		description: 'The cancel button title',
	},
	continueButtonTitle: {
		id: 'automation-platform.common.continue-button-title',
		defaultMessage: 'Continue',
		description: 'The continue button title',
	},
} as const;

export default messages;
