import { defineMessages } from 'react-intl-next';
export const selectionExtensionMessages: {
    selectionExtensionDropdownButtonLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; externalExtensionsHeading: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	selectionExtensionDropdownButtonLabel: {
		id: 'fabric.editor.selectionExtensionDropdownButtonLabel',
		defaultMessage: 'Select app',
		description: 'Label for the selection extension dropdown button',
	},
	externalExtensionsHeading: {
		id: 'fabric.editor.externalExtensionsHeading',
		defaultMessage: 'Apps',
		description:
			'Heading text shown in the selection toolbar overflow dropdown to label the section containing external app extensions.',
	},
});
