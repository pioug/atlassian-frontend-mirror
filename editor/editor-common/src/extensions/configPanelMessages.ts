import { defineMessages } from 'react-intl';

export const configPanelMessages: {
	configFailedToLoad: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	submit: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	cancel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	close: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	required: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	invalid: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	isMultipleAndRadio: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	addField: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	removeField: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	createOption: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	documentation: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	help: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	custom: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	from: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	to: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	expand: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	collapse: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	errorBoundaryTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	errorBoundaryNote: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	configFailedToLoad: {
		id: 'fabric.editor.configFailedToLoad',
		defaultMessage: 'Failed to load',
		description: 'Displayed when the config panel fails to load fields',
	},
	submit: {
		id: 'fabric.editor.configPanel.submit',
		defaultMessage: 'Submit',
		description:
			'Label for a button in the extension configuration panel that the user clicks to submit and apply configuration changes.',
	},
	cancel: {
		id: 'fabric.editor.configPanel.cancel',
		defaultMessage: 'Cancel',
		description:
			'Label for a button in the extension configuration panel that the user clicks to cancel and discard configuration changes.',
	},
	close: {
		id: 'fabric.editor.configPanel.close',
		defaultMessage: 'Close',
		description:
			'Label for a button in the extension configuration panel that the user clicks to close the panel.',
	},
	required: {
		id: 'fabric.editor.configPanel.required',
		defaultMessage: 'Required field',
		description:
			'The text is shown as a validation message below a form field in the extension configuration panel when the user attempts to submit the form without filling in a required field.',
	},
	invalid: {
		id: 'fabric.editor.configPanel.invalid',
		defaultMessage: 'Invalid field',
		description: 'Validation message when a field value is not acceptable',
	},
	isMultipleAndRadio: {
		id: 'fabric.editor.configPanel.fieldTypeError.isMultipleAndRadio',
		defaultMessage: 'Can not combine isMultiple with style: radio',
		description:
			'Error message displayed in the extension configuration panel when isMultiple and radio style options are incorrectly combined.',
	},
	addField: {
		id: 'fabric.editor.configPanel.formType.addField',
		defaultMessage: 'Add field',
		description: 'Button to add a new field in nested forms',
	},
	removeField: {
		id: 'fabric.editor.configPanel.formType.removeField',
		defaultMessage: 'Remove field',
		description: 'Button to remove a field in nested forms',
	},
	createOption: {
		id: 'fabric.editor.configPanel.customSelect.createOption',
		defaultMessage: 'Create',
		description:
			'The text is shown on a button in the extension configuration panel that allows the user to create a new custom option in a select (drop-down) field.',
	},
	documentation: {
		id: 'fabric.editor.configPanel.documentation',
		defaultMessage: 'Documentation',
		description:
			'The text is shown as the label of a link in the extension configuration panel that navigates the user to external documentation for the extension.',
	},
	help: {
		id: 'fabric.editor.configPanel.help',
		defaultMessage: 'Need help?',
		description: 'Label for documentation link v.2 (to replace "Documentation" text)',
	},
	custom: {
		id: 'fabric.editor.configPanel.dateRange.option.custom',
		defaultMessage: 'Custom',
		description: 'Label for the option "Custom" in the date range UI element',
	},
	from: {
		id: 'fabric.editor.configPanel.dateRange.custom.from',
		defaultMessage: 'From',
		description:
			'Label for the initial date when the option "Custom" is selected in the date range UI element',
	},
	to: {
		id: 'fabric.editor.configPanel.dateRange.custom.to',
		defaultMessage: 'To',
		description:
			'Label for the end date when the option "Custom" is selected in the date range UI element',
	},
	expand: {
		id: 'fabric.editor.configPanel.dateRange.grouping.expand',
		defaultMessage: 'Expand',
		description:
			'The text is shown on a button in the extension configuration panel date range section that expands a collapsed group of related input fields.',
	},
	collapse: {
		id: 'fabric.editor.configPanel.dateRange.grouping.collapse',
		defaultMessage: 'Collapse',
		description:
			'The text is shown on a button in the extension configuration panel date range section that collapses an expanded group of related input fields.',
	},
	errorBoundaryTitle: {
		id: 'fabric.editor.configPanel.errorBoundary.title',
		defaultMessage: 'Something went wrong.',
		description:
			'The text is shown as the heading in an error boundary fallback within the extension configuration panel when an unexpected error occurs and the panel cannot be rendered.',
	},
	errorBoundaryNote: {
		id: 'fabric.editor.configPanel.errorBoundary.note',
		defaultMessage: `We've let the team know. You can still edit and publish this page, or check the error console for more information.`,
		description:
			'The text is shown as an explanatory note in the error boundary fallback within the extension configuration panel, advising the user that the error has been reported and suggesting they continue editing or check the error console.',
	},
});
