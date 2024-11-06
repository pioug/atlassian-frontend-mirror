import { defineMessages } from 'react-intl-next';

export const annotationMessages = defineMessages({
	createComment: {
		id: 'fabric.editor.createComment',
		defaultMessage: 'Comment',
		description: 'Create/add an inline comment based on the users selection',
	},
	// TODO: Remove this message when the editor_inline_comments_on_inline_nodes FF is removed
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
	createCommentOnInlineNodeSpotlightBody: {
		id: 'fabric.editor.createCommentOnInlineNodeSpotlight.body',
		defaultMessage:
			'You can now leave comments on inline elements like links, dates, statuses and mentions.',
		description:
			'The body content of the spotlight message that appears when the user can leave comments on inline nodes',
	},
	createCommentOnInlineNodeSpotlightAction: {
		id: 'fabric.editor.createCommentOnInlineNodeSpotlight.action',
		defaultMessage: 'Got it',
		description: 'The content of the action button that closes the spotlight',
	},
});
