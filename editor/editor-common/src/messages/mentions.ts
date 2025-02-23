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
});
