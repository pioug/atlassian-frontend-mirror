import { defineMessages } from 'react-intl-next';

export const messages: {
	verifiedIconDefaultTooltip: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	verifiedIconDefaultTooltip: {
		id: 'ptc-directory.team-profile-page.team-name.verified-team.icon.tooltip',
		defaultMessage: 'This team is verified because it can only be changed by admin.',
		description: 'Tooltip text for the verified team icon',
	},
});
