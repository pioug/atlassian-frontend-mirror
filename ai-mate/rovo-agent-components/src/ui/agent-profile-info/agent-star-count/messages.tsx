import { defineMessages } from 'react-intl';

export const messages: {
	starredCount: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	starredCount: {
		id: 'ai-mate.agent-profile-info.starred-count',
		defaultMessage: '{starCount} {starCount, plural, one {user} other {users}}',
		description: 'Text showing the number of times an agent has been favourited or starred',
	},
});
