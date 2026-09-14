import { defineMessages, type MessageDescriptor } from 'react-intl';

export const contributorTagMessages: {
	changedBy: MessageDescriptor;
	changedByAgent: MessageDescriptor;
	changedByConnected: MessageDescriptor;
	externalAgentName: MessageDescriptor;
} = defineMessages({
	changedBy: {
		id: 'editor-plugin-show-diff.ContributorTag.changedBy',
		defaultMessage: 'Changed by {name}',
		description:
			'Screen-reader label and tooltip for the tag pinned to a highlighted change in the version-history diff, naming the single person or agent that made the change. The name placeholder is the contributor display name.',
	},
	changedByAgent: {
		id: 'editor-plugin-show-diff.ContributorTag.changedByAgent',
		defaultMessage: 'Changed by {name}, an AI agent',
		description:
			'Screen-reader label and tooltip for the tag pinned to a highlighted change in the version-history diff, when a named AI agent made the change rather than a person. The name placeholder is the agent display name.',
	},
	changedByConnected: {
		id: 'editor-plugin-show-diff.ContributorTag.changedByConnected',
		defaultMessage: 'Changed by {agentName} with {userName}',
		description:
			'Screen-reader label and tooltip for the tag pinned to a highlighted change in the version-history diff when an AI agent made the change on behalf of a user. The agentName placeholder is the agent display name. The userName placeholder is the display name of the user that invoked the agent.',
	},
	externalAgentName: {
		id: 'editor-plugin-show-diff.ContributorTag.externalAgentName',
		defaultMessage: 'External agent',
		description:
			'Fallback display name shown in the contributor tag of the version-history diff for an unidentified third-party agent (for example an MCP or CLI client) that has no name of its own.',
	},
});
