import { defineMessages } from 'react-intl-next';

export const linkMessages = defineMessages({
	openLink: {
		id: 'fabric.editor.openLink',
		defaultMessage: 'Open link in a new tab',
		description:
			'The text is shown as a link action in the editor toolbar or context menu when a user can open a linked URL in a new browser tab.',
	},
	openPreviewPanel: {
		id: 'fabric.editor.openPreviewPanel',
		defaultMessage: 'Open preview panel',
		description: 'Opens preview panel and loads the page inside it',
	},
});
