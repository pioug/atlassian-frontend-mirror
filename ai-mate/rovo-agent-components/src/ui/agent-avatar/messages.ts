import { defineMessages } from 'react-intl-next';

export const messages: {
	agentAvatarLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	agentAvatarLabel: {
		id: 'ai-mate.agent-avatar-label',
		defaultMessage: 'Agent avatar',
		description: 'Accessible label for agent avatar img',
	},
});
