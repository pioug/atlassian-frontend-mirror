import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	edit: {
		id: 'fabric.editor.edit',
		defaultMessage: 'Edit',
		description:
			'The text is shown as a button label in the extension context menu. Triggers opening the properties editor for the selected extension to modify its configuration.',
	},
	deleteElementTitle: {
		id: 'fabric.editor.extension.deleteElementTitle',
		defaultMessage: 'Delete element',
		description:
			'Title text for confirm modal when deleting an extension linked to a data consumer.',
	},
	unnamedSource: {
		id: 'fabric.editor.extension.sourceNoTitledName',
		defaultMessage: 'this element',
		description: 'The current element without preset name been selected',
	},
	confirmDeleteLinkedModalOKButton: {
		id: 'fabric.editor.extension.confirmDeleteLinkedModalOKButton',
		defaultMessage: 'Delete',
		description:
			'Action button label for confirm modal when deleting an extension linked to a data consumer.',
	},
	confirmDeleteLinkedModalMessage: {
		id: 'fabric.editor.extension.confirmDeleteLinkedModalMessage',
		defaultMessage: 'Deleting {nodeName} will break anything connected to it.',
		description: 'Message for confirm modal when deleting a extension linked to an data consumer.',
	},
	confirmModalCheckboxLabel: {
		id: 'fabric.editor.floatingToolbar.confirmModalCheckboxLabel',
		defaultMessage: 'Also delete connected elements',
		description:
			'Label for a checkbox in a confirm modal that allows the user to also delete connected elements when deleting an extension.',
	},
	saveIndicator: {
		id: 'fabric.editor.extensions.config-panel.save-indicator',
		defaultMessage: 'All changes are always autosaved',
		description:
			'Informational message displayed in the extension configuration panel to reassure users that their changes are being saved automatically without requiring manual save action.',
	},
	panelLoadingError: {
		id: 'fabric.editor.extensions.config-panel.loading-error.non-final',
		defaultMessage: 'We ran into a bit of trouble. Refresh to try again.',
		description:
			'Error message displayed when the extension configuration panel fails to load. Instructs users to refresh the page to attempt loading the panel again.',
	},
	extensionLoadingError: {
		id: 'fabric.editor.extension.loading-error',
		defaultMessage: 'Error loading the extension!',
		description:
			'Error message displayed when an extension fails to load in the editor. Indicates a problem occurred during the extension initialization or rendering process.',
	},
});

export const configPanelMessages = defineMessages({
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
		description: 'Validation message for required field',
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
		description: 'Create a new option for a select field',
	},
	documentation: {
		id: 'fabric.editor.configPanel.documentation',
		defaultMessage: 'Documentation',
		description: 'Label for the documentation link',
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
		description: 'Label for expanding a group of fields',
	},
	collapse: {
		id: 'fabric.editor.configPanel.dateRange.grouping.collapse',
		defaultMessage: 'Collapse',
		description: 'Label for collapsing a group of fields',
	},
	errorBoundaryTitle: {
		id: 'fabric.editor.configPanel.errorBoundary.title',
		defaultMessage: 'Something went wrong.',
		description: 'Title for uncaught config panel error',
	},
	errorBoundaryNote: {
		id: 'fabric.editor.configPanel.errorBoundary.note',
		defaultMessage: `We've let the team know. You can still edit and publish this page, or check the error console for more information.`,
		description: 'Note for uncaught config panel error',
	},
});
