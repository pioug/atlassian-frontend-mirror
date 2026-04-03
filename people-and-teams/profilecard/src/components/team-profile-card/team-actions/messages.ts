import { defineMessages } from 'react-intl-next';

export const messages: {
    giveKudos: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	giveKudos: {
		id: 'team-profile-card.team-actions.give-kudos',
		defaultMessage: 'Give kudos',
		description: 'Button label text for giving kudos to a team in the profile actions',
	},
});
