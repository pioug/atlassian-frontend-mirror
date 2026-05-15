import { defineMessages } from 'react-intl';

type MessageKeys = 'description';

const message: Record<MessageKeys, { id: string; defaultMessage: string; description?: string }> = defineMessages({
	description: {
		id: 'link-create.unknown-error.description',
		defaultMessage:
			'Refresh the page, or contact <a>Atlassian Support</a> if this keeps happening.',
		description: 'Description when an unknown error occurs',
	},
});

export default message;
