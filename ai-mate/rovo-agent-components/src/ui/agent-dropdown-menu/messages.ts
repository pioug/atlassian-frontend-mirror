import { defineMessages } from 'react-intl-next';

export default defineMessages({
	chatToAgentButton: {
		id: 'rovo-chat.view-agent.chat-to-agent-button',
		defaultMessage: 'Chat to Agent',
		description: 'Button to chat to agent',
	},
	moreActionsLabel: {
		id: 'rovo-chat.view-agent.more-actions-label',
		defaultMessage: 'More actions',
		description: 'More actions dropdown menu label',
	},
	duplicateAgent: {
		id: 'rovo-chat.view-agent.duplicate-agent',
		defaultMessage: 'Duplicate Agent',
		description: 'Button to duplicate an agent',
	},
	editAgent: {
		id: 'rovo-chat.view-agent.edit-agent',
		defaultMessage: 'Edit Agent',
		description: 'Button to edit an agent',
	},
	deleteAgent: {
		id: 'rovo-chat.view-agent.delete-agent',
		defaultMessage: 'Delete Agent',
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
		defaultMessage: 'View Agent',
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
} as const);
