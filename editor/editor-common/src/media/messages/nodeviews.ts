import { defineMessages } from 'react-intl';

export const nodeViewsMessages: {
	mediaGroupDeleteLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	mediaGroupDeleteLabel: {
		id: 'fabric.editor.mediaGroupDeleteLabel',
		defaultMessage: 'delete',
		description:
			'Accessible label for the delete icon button shown on a media group item in the editor, used to remove the media file from the document.',
	},
});
