import { defineMessages } from 'react-intl';

export const avatarGroupMessages: {
	agentWithUser: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	anonymousCollaborator: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	editors: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	editors: {
		id: 'fabric.editor.editors',
		defaultMessage: 'Editors',
		description: 'classifying the people that are currently editing the document',
	},
	anonymousCollaborator: {
		id: 'fabric.editor.anonymous-collaborator',
		defaultMessage: 'Anonymous collaborator',
		description:
			'The name of an anonymous collaborator, used when the participant name is not specified',
	},
	agentWithUser: {
		id: 'fabric.editor.agent-with-user',
		defaultMessage: '{agentName} with {userName}',
		description:
			'Tooltip text for an agent avatar in the editor presence avatar group. The agentName placeholder is the AI agent display name. The userName placeholder is the display name of the user the agent is acting on behalf of.',
	},
});
