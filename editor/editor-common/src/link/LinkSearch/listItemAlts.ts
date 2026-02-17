import type { IntlShape } from 'react-intl-next';
import { defineMessages } from 'react-intl-next';

const messages = defineMessages({
	story: {
		id: 'fabric.editor.story',
		defaultMessage: 'Story',
		description:
			'Alt text for the issue type icon displayed in link search results when the linked item is a Story issue type.',
	},
	epic: {
		id: 'fabric.editor.epic',
		defaultMessage: 'Epic',
		description:
			'Alt text for the issue type icon displayed in link search results when the linked item is an Epic issue type.',
	},
	task: {
		id: 'fabric.editor.task',
		defaultMessage: 'Task',
		description:
			'Alt text for the issue type icon displayed in link search results when the linked item is a Task issue type.',
	},
	bug: {
		id: 'fabric.editor.bug',
		defaultMessage: 'Bug',
		description:
			'Alt text for the issue type icon displayed in link search results when the linked item is a Bug issue type.',
	},
	subTask: {
		id: 'fabric.editor.subTask',
		defaultMessage: 'Sub-task',
		description:
			'Alt text for the issue type icon displayed in link search results when the linked item is a Sub-task issue type.',
	},
	improvement: {
		id: 'fabric.editor.improvement',
		defaultMessage: 'Improvement',
		description:
			'Alt text for the issue type icon displayed in link search results when the linked item is an Improvement issue type.',
	},
	defaultAltText: {
		id: 'fabric.editor.defaultAltText',
		defaultMessage: 'Document',
		description: 'Default alt text for ListItem image',
	},
});

// Workaround to get alt text for images from url
// Can be removed when alt={iconAlt} will be available from GraphQL
export const getCorrectAltByIconUrl = (iconUrl: string, intl: IntlShape): string => {
	let alt = intl.formatMessage(messages.defaultAltText);

	if (iconUrl.includes('story.svg')) {
		alt = intl.formatMessage(messages.story);
	}

	if (iconUrl.includes('epic.svg')) {
		alt = intl.formatMessage(messages.epic);
	}

	if (iconUrl.includes('avatarId=10318')) {
		alt = intl.formatMessage(messages.task);
	}

	if (iconUrl.includes('avatarId=10303')) {
		alt = intl.formatMessage(messages.bug);
	}

	if (iconUrl.includes('avatarId=10518')) {
		alt = intl.formatMessage(messages.subTask);
	}

	if (iconUrl.includes('avatarId=10310')) {
		alt = intl.formatMessage(messages.improvement);
	}

	return alt;
};
