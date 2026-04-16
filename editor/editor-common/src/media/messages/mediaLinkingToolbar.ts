import { defineMessages } from 'react-intl';

export const mediaLinkToolbarMessages: {
	backLink: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	backLink: {
		id: 'fabric.editor.backLink',
		defaultMessage: 'Go back',
		description: 'Go back from media linking toolbar to main toolbar',
	},
});
