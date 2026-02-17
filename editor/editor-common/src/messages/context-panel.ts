import { defineMessages } from 'react-intl-next';
export const contextPanelMessages = defineMessages({
	panelLabel: {
		id: 'fabric.editor.contextPanel.panelLabel',
		defaultMessage: 'Context panel',
		description:
			'Accessibility label for the context panel dialog in the editor. Used as an aria-label to identify the panel for screen reader users.',
	},
	panelContentLabel: {
		id: 'fabric.editor.contextPanel.panelContentLabel',
		defaultMessage: 'Scrollable context panel content',
		description: 'Label for the context panel content',
	},
});
