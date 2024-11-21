import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	starredCount: {
		id: 'ai-mate.agent-profile-info.starred-count',
		defaultMessage: '{starCount} {starCount, plural, one {user} other {users}}',
		description: 'Text showing the number of times an agent has been favourited or starred',
	},
});
