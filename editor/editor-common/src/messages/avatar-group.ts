import { defineMessages } from 'react-intl-next';

export const avatarGroupMessages = defineMessages({
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
});
