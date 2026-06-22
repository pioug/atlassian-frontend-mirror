import { defineMessages } from 'react-intl';

export const mentionMessages: {
	inviteButton: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inviteItemTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inviteTeammateInvalidEmail: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mentionsAddLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mentionsIconLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mentionsNodeLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	sendInvite: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	typeAheadSectionAgents: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	typeAheadSectionAgentsLabs: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	typeAheadSectionPeople: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	unknownLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	inviteItemTitle: {
		id: 'fabric.editor.inviteItem.title',
		defaultMessage:
			'{userRole, select, admin {Invite} trusted {Invite} other {Add}} teammate to {productName}',
		description: 'Title of the invite teammate item in typeahead plugin',
	},
	mentionsAddLabel: {
		id: 'fabric.editor.mentionsAddLabel',
		defaultMessage: 'add-icon',
		description: 'icon label to describe adding a new mention',
	},
	mentionsIconLabel: {
		id: 'fabric.editor.mentionsIconLabel',
		defaultMessage: 'Mention',
		description:
			'Accessible label for the mention icon displayed in the editor toolbar, indicating that clicking it inserts a mention.',
	},
	mentionsNodeLabel: {
		id: 'fabric.editor.mentionNode.label',
		defaultMessage: 'Tagged user',
		description:
			'Label to indicate mention node to Screen reader users, that preceeds with user name ex: "Tagged user @XXX',
	},
	unknownLabel: {
		id: 'fabric.editor.unknown.label',
		defaultMessage: 'Unknown',
		description:
			'Accessible label for a mention node when the referenced user cannot be identified or resolved.',
	},
	inviteTeammateInvalidEmail: {
		id: 'fabric.editor.inviteItem.invalidEmail',
		defaultMessage: 'Enter a valid email address',
		description:
			'By line text for invite teammate option shown in mentions when the email is invalid. This is a placeholder for the actual error message that will be shown to the user.',
	},
	sendInvite: {
		id: 'fabric.editor.inviteItem.sendInvite',
		defaultMessage: 'Send request to invite teammate',
		description: 'By line text for send request to invite teammate option shown in mentions.',
	},
	inviteButton: {
		id: 'fabric.editor.inviteItem.inviteButton',
		defaultMessage: 'Invite',
		description: 'Label for the invite button shown in the mention typeahead invite item.',
	},
	typeAheadSectionPeople: {
		id: 'fabric.editor.typeAhead.mentionSection.people',
		defaultMessage: 'People',
		description: 'Section header for people (non-agent) results in the mention type-ahead menu',
	},
	typeAheadSectionAgents: {
		id: 'fabric.editor.typeAhead.mentionSection.agents',
		defaultMessage: 'Agents',
		description: 'Section header for agent results in the mention type-ahead menu',
	},
	typeAheadSectionAgentsLabs: {
		id: 'fabric.editor.typeAhead.mentionSection.agentsLabs',
		defaultMessage: 'LABS',
		description:
			'Lozenge label shown next to the Agents section header in the mention type-ahead menu to indicate that agent mentions are experimental (Labs).',
	},
});
