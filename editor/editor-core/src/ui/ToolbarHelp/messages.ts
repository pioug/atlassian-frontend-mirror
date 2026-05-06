import { defineMessages } from 'react-intl';

export const messages: {
	toolbarHelpTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	toolbarHelpTitle: {
		id: 'fabric.editor.headingLink.toolbarHelpTitle',
		defaultMessage: 'Open help dialog',
		description:
			'Label for the toolbar help button in the editor. When clicked, this button opens the help dialog.',
	},
});
