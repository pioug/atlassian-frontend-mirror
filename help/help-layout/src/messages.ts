import { defineMessages } from 'react-intl-next';

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
		description: '',
	},
	help_panel_header_title: {
		id: 'helpPanel.header.title',
		defaultMessage: 'Help',
		description: '',
	},
	help_panel_header_back: {
		id: 'helpPanel.header.back',
		defaultMessage: 'Back',
		description: '',
	},
	help_panel_header_close: {
		id: 'helpPanel.header.close',
		defaultMessage: 'Close',
		description: '',
	},
	help_panel_header_close_button: {
		id: 'helpPanel.header.close.button',
		defaultMessage: 'Close Help Panel',
		description: '',
	},
	help_panel_new_chat_button: {
		id: 'helpPanel.header.new.chat.button',
		defaultMessage: 'New',
		description: 'Start a new chat with CSM agent',
	},
});
