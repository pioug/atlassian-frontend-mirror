import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	agentDeletedSuccessFlagTitle: {
		id: 'profilecard.agent-profile-card.delete-agent-success-flag-title',
		defaultMessage: 'Agent deleted',
		description: 'Flag message title displayed when an agent is deleted',
	},
	agentDeletedSuccessFlagDescription: {
		id: 'profilecard.agent-profile-card.delete-agent-success-flag-description',
		defaultMessage: 'You deleted {agentName}',
		description: 'Flag message description displayed when an agent is deleted',
	},
	agentDeletedErrorFlagTitle: {
		id: 'profilecard.agent-profile-card.delete-agent-error-flag-title',
		defaultMessage: 'Failed to delete Agent',
		description: 'Flag message title displayed when there is an error deleting agent',
	},
	agentDeletedErrorFlagDescription: {
		id: 'profilecard.agent-profile-card.delete-agent-error-flag-description',
		defaultMessage: 'Something went wrong while deleting the agent. Try again in a few moments.',
		description: 'Flag message description displayed when there is an error deleting agent',
	},
});
