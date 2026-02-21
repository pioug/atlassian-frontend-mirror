import { defineMessages } from 'react-intl-next';

export const mentionMessages = defineMessages({
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
		description: 'icon label to describe the mention icon',
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
		description: 'Label to indicate unknown mention node',
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
});
