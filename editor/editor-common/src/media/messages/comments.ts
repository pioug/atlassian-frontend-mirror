import { defineMessages } from 'react-intl';

export const commentMessages: {
	addCommentOnMedia: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	viewCommentsOnMedia: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	viewAndAddCommentsOnMedia: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	addCommentOnMedia: {
		id: 'fabric.editor.addCommentOnMedia',
		defaultMessage: 'Add comment',
		description: 'Add a comment for this media (image/video)',
	},
	viewCommentsOnMedia: {
		id: 'fabric.editor.viewCommentOnMedia',
		defaultMessage: 'View comments',
		description: 'View a existing comment for this media (image/video)',
	},
	viewAndAddCommentsOnMedia: {
		id: 'fabric.editor.viewAndAddCommentsOnMedia',
		defaultMessage: 'View and add comments',
		description:
			'The text is shown on a button in the media floating toolbar that opens the comments panel, allowing the user to view existing comments and add new ones for the selected image or media item.',
	},
});
