import { defineMessages } from 'react-intl';

export const messages: {
	help_loading: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	help_panel_header_back: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	help_panel_header_close: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	help_panel_header_close_button: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	help_panel_header_title: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	help_panel_new_chat_button: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	help_loading: {
		id: 'helpPanel.loading',
		defaultMessage: 'Loading',
		description: 'Loading indicator text shown in the help panel while content is being fetched.',
	},
	help_panel_header_title: {
		id: 'helpPanel.header.title',
		defaultMessage: 'Help',
		description: 'Title displayed in the header of the help panel.',
	},
	help_panel_header_back: {
		id: 'helpPanel.header.back',
		defaultMessage: 'Back',
		description: 'Back navigation button label in the help panel header.',
	},
	help_panel_header_close: {
		id: 'helpPanel.header.close',
		defaultMessage: 'Close',
		description: 'Close button label in the help panel header.',
	},
	help_panel_header_close_button: {
		id: 'helpPanel.header.close.button',
		defaultMessage: 'Close Help Panel',
		description:
			'Aria-label for the close button in the help panel header; provides a more descriptive name for screen readers than the visible "Close" label (helpPanel.header.close). Translators should use a phrase that conveys closing the entire help panel.',
	},
	help_panel_new_chat_button: {
		id: 'helpPanel.header.new.chat.button',
		defaultMessage: 'New',
		description:
			'Label for the button in the help panel header that starts a new chat session with the CSM agent.',
	},
});
