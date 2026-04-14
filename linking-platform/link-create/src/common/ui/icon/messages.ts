import { defineMessages } from 'react-intl';

export const iconLabelMessages: {
	pageIconLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	liveDocIconLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	pageIconLabel: {
		id: 'link-create.page-icon-label',
		defaultMessage: 'Page',
		description: 'Label for Page icons used in the link create modal',
	},
	liveDocIconLabel: {
		id: 'link-create.live-doc-icon-label',
		defaultMessage: 'Live Doc',
		description: 'Label for Live Doc icons used in the link create modal',
	},
});
