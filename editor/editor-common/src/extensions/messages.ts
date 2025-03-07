import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	edit: {
		id: 'fabric.editor.edit',
		defaultMessage: 'Edit',
		description: 'Edit the properties for this extension.',
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
		description: 'checkbox label text',
	},
	saveIndicator: {
		id: 'fabric.editor.extensions.config-panel.save-indicator',
		defaultMessage: 'All changes are always autosaved',
		description:
			'Message shown to the user to notify to them that we save the changes automatically.',
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
		description: 'Submit button label',
	},
	cancel: {
		id: 'fabric.editor.configPanel.cancel',
		defaultMessage: 'Cancel',
		description: 'Cancel button label',
	},
	close: {
		id: 'fabric.editor.configPanel.close',
		defaultMessage: 'Close',
		description: 'Close button label',
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
		description: 'Configuration error',
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
	objectSidebarPanelHeaderLabel: {
		id: 'fabric.editor.configPanel.objectSidebarPanelHeaderLabel',
		defaultMessage: ' ',
		description: 'Keep this empty. Defined it as headerLabel is required field.',
	},
});
