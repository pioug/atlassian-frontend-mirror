import { defineMessages } from 'react-intl';

export const messages: {
	showMoreIconLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	showMoreIconLabel: {
		id: 'team-profile-card.team-actions.more-actions.show-more-icon-label',
		defaultMessage: 'Show more',
		description: 'Accessibility label for the show more icon in team profile actions menu',
	},
});
