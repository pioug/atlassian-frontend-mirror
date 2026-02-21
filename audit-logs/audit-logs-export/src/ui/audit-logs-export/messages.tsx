import { defineMessages } from 'react-intl-next';

export const defaultMessages: {
	ariaLabelCheckbox: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cancel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	errorFlagDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	errorFlagTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	export: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	exportButton: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	exportTermsDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	exportTermsError: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	exportTermsTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	modalDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	modalDescription2: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	modalTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	successFlagDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	successFlagTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	exportButton: {
		id: 'organization.audit.log.export.button',
		defaultMessage: 'Export log',
		description: 'Button text for exporting audit log',
	},
	modalTitle: {
		id: 'organization.audit.log.export.modal.title',
		defaultMessage: 'Export log',
		description: 'Title of the export modal',
	},
	modalDescription: {
		id: 'organization.audit.log.export.modal.description',
		defaultMessage:
			"We'll email you a CSV file of all activities {matchFilterText} is ready to download.",
		description: 'Description text in the export modal',
	},
	modalDescription2: {
		id: 'organization.audit.log.export.modal.description.match',
		defaultMessage: 'matching your filter criteria',
		description: 'Text for "match" in the modal description',
	},
	exportTermsTitle: {
		id: 'organization.audit.log.export.terms.title',
		defaultMessage: 'Please read and accept to continue',
		description: 'Title for the terms and conditions section',
	},
	exportTermsDescription: {
		id: 'organization.audit.log.export.terms.description',
		defaultMessage:
			"I understand that if I share this audit log data with people that don't otherwise have access to it, any existing user permissions set in Atlassian Administration and other apps will no longer apply to them.",
		description: 'Terms and conditions description text',
	},
	exportTermsError: {
		id: 'organization.audit.log.export.terms.error',
		defaultMessage: 'This field is required',
		description: 'Error message when terms are not accepted',
	},
	cancel: {
		id: 'organization.audit.log.export.modal.cancel',
		defaultMessage: 'Cancel',
		description: 'Cancel button text',
	},
	export: {
		id: 'organization.audit.log.export.modal.export',
		defaultMessage: 'Export',
		description: 'Export button text in modal',
	},
	successFlagTitle: {
		id: 'organization.audit.log.export.success.title',
		defaultMessage: 'Exporting logs',
		description: 'Success flag title when export starts',
	},
	errorFlagTitle: {
		id: 'organization.audit.log.export.error.title',
		defaultMessage: 'Something went wrong',
		description: 'Error flag title when export fails',
	},
	successFlagDescription: {
		id: 'organization.audit.log.export.success.description',
		defaultMessage:
			'Check your email to download the CSV file. It might take a few minutes to arrive.',
		description: 'Success flag description when export starts',
	},
	errorFlagDescription: {
		id: 'organization.audit.log.export.error.description',
		defaultMessage: 'Try again later',
		description: 'Error flag description when export fails',
	},
	ariaLabelCheckbox: {
		id: 'organization.audit.log.export.modal.aria.label.checkbox',
		defaultMessage: 'checkbox',
		description: 'Aria label for checkbox',
	},
});
