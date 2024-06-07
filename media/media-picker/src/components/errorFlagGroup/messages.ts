import { defineMessages } from 'react-intl-next';

export const errorFlagMessages = defineMessages({
	errorTitle: {
		id: 'fabric.media.errorFlagTitle',
		defaultMessage: 'Your file failed to upload',
		description: 'a title for a flag that describes that a file failed to upload',
	},
	uploadRejectionDescription: {
		id: 'fabric.media.uploadRejectionFlagDescription',
		defaultMessage: '{fileName} is too big to upload. Files must be less than {limit}.',
		description: 'a description for a flag detailing that a file was too large to upload',
	},
	fileEmptyDescription: {
		id: 'fabric.media.fileEmptyFlagDescription',
		defaultMessage: 'The file you selected was empty. Please select another file and try again.',
		description: 'a description for a flag detailing that a file was zero bytes',
	},
});
