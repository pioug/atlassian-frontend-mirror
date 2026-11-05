import { defineMessages } from 'react-intl';

export const messages: {
	confirmDeleteLinkedModalMessage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDeleteLinkedModalOKButton: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmModalCheckboxLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	customWidth: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteElementTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	edit: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	extensionLoadingError: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	panelLoadingError: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	saveIndicator: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unknownMacroHeader: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unknownMacroPlaceholderAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unnamedSource: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	customWidth: {
		id: 'fabric.editor.extension.customWidth',
		defaultMessage: 'Custom width',
		description:
			'Label for the layout button in the extension toolbar when the extension has been resized to a custom width.',
	},
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
	unknownMacroPlaceholderAriaLabel: {
		id: 'fabric.editor.extension.unknownMacroPlaceholderAriaLabel',
		defaultMessage: 'Unknown macro placeholder',
		description:
			'Accessible label for the unknown macro fallback block shown when a Confluence macro cannot be resolved.',
	},
	unknownMacroHeader: {
		id: 'fabric.editor.extension.unknownMacroHeader',
		defaultMessage: "Unknown macro: ''{macroTitle}''",
		description: 'Header text for an unresolved Confluence macro placeholder.',
	},
});
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { configPanelMessages } from './configPanelMessages';
