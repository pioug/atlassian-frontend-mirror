import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	agentCreatedBy: {
		id: 'ai-mate.agent-profile-info.created-by',
		defaultMessage: 'Rovo Agent by {creatorNameWithLink}',
		description: 'Message to show who created this Rovo agent',
	},
	agentDeactivated: {
		id: 'ai-mate.agent-profile-info.deactivated',
		defaultMessage: '(deactivated)',
		description: 'Message to show that this agent is deactivated',
	},
	starredCount: {
		id: 'ai-mate.agent-profile-info.starred-count',
		defaultMessage: '{count} starred',
		description: 'Message to show how many times this agent has been starred by users',
	},
	hiddenIcon: {
		id: 'ai-mate.agent-profile-info.hidden-icon',
		defaultMessage: 'Hidden',
		description: 'Icon to show that this agent is hidden',
	},
	hiddenTooltip: {
		id: 'ai-mate.agent-profile-info.hidden-tooltip',
		defaultMessage: "Agent won't show in search results",
		description: 'Tooltip to explain what strikethough eye icon means',
	},
	starAgentTooltip: {
		id: 'ai-mate.agent-profile-info.star-agent-tooltip',
		defaultMessage: 'Star Agent',
		description: 'Tooltip to explain what star icon does',
	},
});
