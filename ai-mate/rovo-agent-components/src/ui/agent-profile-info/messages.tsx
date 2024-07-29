import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	agentCreatedBy: {
		id: 'ai-mate.agent-profile-info.created-by',
		defaultMessage: 'Rovo agent by {creatorNameWithLink}',
		description: 'Message to show who created this Rovo agent',
	},
	starredCount: {
		id: 'ai-mate.agent-profile-info.starred-count',
		defaultMessage: '{count} starred',
		description: 'Message to show how many times this agent has been starred by users',
	},
});
