import { defineMessages } from 'react-intl-next';

export const annotationMessages = defineMessages({
	createComment: {
		id: 'fabric.editor.createComment',
		defaultMessage: 'Comment',
		description: 'Create/add an inline comment based on the users selection',
	},
	// TODO: Remove this message when the platform.editor.allow-inline-comments-for-inline-nodes-round-2_ctuxz FF is removed
	createCommentInvalid: {
		id: 'fabric.editor.createCommentInvalid',
		defaultMessage: 'You can only comment on text and headings',
		description:
			'Error message to communicate to the user they can only do the current action in certain contexts',
	},
	createCommentDisabled: {
		id: 'fabric.editor.createCommentDisabled',
		defaultMessage:
			'You can only comment on text, headings, emojis, dates, mentions, links, and statuses.',
		description:
			'Error message to communicate to the user they can only do the current action in certain contexts',
	},
	toolbar: {
		id: 'fabric.editor.annotationToolbar',
		defaultMessage: 'Annotation toolbar',
		description:
			'A label for a toolbar (UI element) that creates annotations/comments in the document',
	},
});
