import { defineMessages } from 'react-intl';

const _default_1: {
	copyAgentLinkLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	copyAgentLinkLabel: {
		id: 'rovo-chat.browse-agents.copy-agent-label',
		defaultMessage: 'Copy link to {agentName}',
		description:
			"Button label/aria label for copying agent link to clipboard. When clicked, copies the agent's URL to clipboard. The {agentName} placeholder is replaced with the agent's name for unique accessible labels.",
	},
});
export default _default_1;
