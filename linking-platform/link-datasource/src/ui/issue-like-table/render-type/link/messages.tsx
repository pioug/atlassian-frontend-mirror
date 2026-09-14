import { defineMessages } from 'react-intl';

export const messages: {
	opensInNewTab: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	opensInNewTab: {
		defaultMessage: '(opens in a new tab)',
		description:
			'Visually hidden hint appended to a link that opens in a new browser tab, so screen reader users are informed of this before activating it.',
		id: 'link-datasource.issue-like-table.render-type.link.opensInNewTab',
	},
});
