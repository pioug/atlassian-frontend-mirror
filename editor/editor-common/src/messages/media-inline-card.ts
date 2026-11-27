import { defineMessages } from 'react-intl';
export const messages: {
	unableToLoadContent: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	failedToUpload: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	inlineImageLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	unableToLoadContent: {
		id: 'fabric.editor.unableToLoadContent',
		defaultMessage: "We couldn't load this content",
		description: 'Display this message when there is an error loading file content',
	},
	failedToUpload: {
		id: 'fabric.editor.failed_to_upload',
		defaultMessage: 'Failed to upload',
		description: 'Display this message when there is an error uploading a file',
	},
	inlineImageLabel: {
		id: 'editor-common.messages.media-inline-card.inlineImageLabel',
		defaultMessage: 'Image',
		description:
			'Accessible name for an inline image in the document, used when the image has no alternative text',
	},
});
