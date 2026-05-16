import { defineMessages } from 'react-intl';

type MessageKeys =
	| 'chatToAgentButton'
	| 'moreActionsLabel'
	| 'moreActionsForLabel'
	| 'duplicateAgent'
	| 'editAgent'
	| 'deleteAgent'
	| 'copyLinkToProfile'
	| 'linkedCopiedToProfile'
	| 'viewAgent'
	| 'viewAgentFullProfile'
	| 'useTemplateButton';

const message: Record<MessageKeys, { id: string; defaultMessage: string; description?: string }> =
	defineMessages({
		chatToAgentButton: {
			id: 'rovo-chat.view-agent.chat-to-agent-button',
			defaultMessage: 'Chat to agent',
			description: 'Button to chat to agent',
		},
		moreActionsLabel: {
			id: 'rovo-chat.view-agent.more-actions-label',
			defaultMessage: 'More actions',
			description: 'More actions dropdown menu label',
		},
		moreActionsForLabel: {
			id: 'rovo-chat.view-agent.more-actions-for-label',
			defaultMessage: 'More actions for {agentName}',
			description: 'More actions dropdown menu label',
		},
		duplicateAgent: {
			id: 'rovo-chat.view-agent.duplicate-agent',
			defaultMessage: 'Duplicate agent',
			description: 'Button to duplicate an agent',
		},
		editAgent: {
			id: 'rovo-chat.view-agent.edit-agent',
			defaultMessage: 'Edit agent',
			description: 'Button to edit an agent',
		},
		deleteAgent: {
			id: 'rovo-chat.view-agent.delete-agent',
			defaultMessage: 'Delete agent',
			description: 'Button to delete an agent',
		},
		copyLinkToProfile: {
			id: 'rovo-chat.view-agent.copy-link-to-profile',
			defaultMessage: 'Copy link',
			description: 'Button to copy the link to the agent profile',
		},
		linkedCopiedToProfile: {
			id: 'rovo-chat.view-agent.link-copied-to-profile',
			defaultMessage: 'Copied URL',
			description: 'Button confirming link to agent profile is copied',
		},
		viewAgent: {
			id: 'rovo-chat.view-agents.view-agent',
			defaultMessage: 'View agent',
			description: 'Button to view an agent',
		},
		viewAgentFullProfile: {
			id: 'rovo-chat.view-agents.view-agent-full-profile',
			defaultMessage: 'View full profile',
			description: 'Button to view an agent full profile',
		},
		useTemplateButton: {
			id: 'rovo-chat.view-agents.use-template-button',
			defaultMessage: 'Use template',
			description: 'Button to copy and use a template',
		},
	});

export default message;
