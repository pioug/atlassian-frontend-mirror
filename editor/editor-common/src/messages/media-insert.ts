import { defineMessages } from 'react-intl';

export const mediaInsertMessages: {
	cancel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	chooseFile: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fileTabTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fromUrlErrorMessage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fromUrlWarning: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	generateTabTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	insert: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	invalidUrlErrorMessage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	linkTabTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	loadPreview: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	localFileErrorMessage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	localFileNetworkErrorMessage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mediaAlt: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	mediaPickerPopupAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	pasteLinkToUpload: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	upload: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	uploadTabTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	loadPreview: {
		id: 'fabric.editor.media.insert.loadPreview',
		defaultMessage: 'Load preview',
		description:
			'Text on a button that loads a preview of a media file that has been linked to from a URL',
	},
	insert: {
		id: 'fabric.editor.media.insert.insert',
		defaultMessage: 'Insert',
		description:
			'Text on the modal action button that inserts the linked media file into the editor document',
	},
	pasteLinkToUpload: {
		id: 'fabric.editor.media.insert.pasteLinkToUpload',
		defaultMessage: 'Paste link to upload',
		description:
			'Placeholder text for the input field where a user can paste (as in copy-paste) a URL to upload a media file',
	},

	cancel: {
		id: 'fabric.editor.media.insert.cancel',
		defaultMessage: 'Cancel',
		description:
			'Text on the modal action button that cancels the media file insertion and closes the modal',
	},
	fromUrlErrorMessage: {
		id: 'fabric.editor.media.insert.fromUrlErrorMessage',
		defaultMessage:
			'Unfortunately, we can’t add this image link. Download the image, then drag and drop onto the page.',
		description:
			'Error message displayed when a user tries to insert an image from a URL that cannot be loaded. This may be because the URL is invalid, there is a network error or any other reason the preview upload does not succeed. When this occurs the suggestion is to attempt downloading the linked file manually and using a local upload instead.',
	},
	fromUrlWarning: {
		id: 'fabric.editor.media.insert.fromUrlWarning',
		defaultMessage:
			'This image might not be visible to others due to source restrictions. Consider uploading the file instead.',
		description:
			'Warning message displayed when a user tries to insert an image from a URL that may not be visible to others due to source restrictions such as not having permissions/authentication to load the image. The suggestion is to upload the file instead.',
	},
	localFileNetworkErrorMessage: {
		id: 'fabric.editor.media.insert.localFileNetworkErrorMessage',
		defaultMessage: 'File upload error. Check file path or network.',
		description: 'Error message displayed when a network error occurs during file upload',
	},
	localFileErrorMessage: {
		id: 'fabric.editor.media.insert.localFileErrorMessage',
		defaultMessage: 'This file couldn’t be uploaded.',
		description: 'Generic catch-all error message displayed when file upload fails',
	},
	mediaAlt: {
		id: 'fabric.editor.media.insert.mediaAlt',
		defaultMessage: 'Preview for uploaded image or video file',
		description: 'Alt text describing a preview of an image uploaded.',
	},
	upload: {
		id: 'fabric.editor.media.insert.upload',
		defaultMessage: 'Upload',
		description: 'Text on a button that opens a file picker dialog to upload a media file',
	},
	linkTabTitle: {
		id: 'fabric.editor.media.insert.linkTabTitle',
		defaultMessage: 'Link',
		description: 'Title of the navigation tab that allows users to insert media from a URL or link',
	},
	fileTabTitle: {
		id: 'fabric.editor.media.insert.fileTabTitle',
		defaultMessage: 'File',
		description: 'Title of the navigation tab that allows users to upload local media files',
	},
	generateTabTitle: {
		id: 'fabric.editor.media.insert.generateTabTitle',
		defaultMessage: 'Create',
		description: 'Title of the navigation tab that allows users to generate an image through AI',
	},
	mediaPickerPopupAriaLabel: {
		id: 'fabric.editor.media.insert.mediaPickerPopupAriaLabel',
		defaultMessage: 'Media picker',
		description: 'Accessibility label for the media picker popup',
	},
	invalidUrlErrorMessage: {
		id: 'fabric.editor.media.insert.invalidUrlErrorMessage',
		defaultMessage: 'Invalid link',
		description: 'Error message displayed when a user tries to insert media from an invalid URL',
	}, 
	uploadTabTitle: {
		id: 'fabric.editor.media.insert.uploadTabTitle',
		defaultMessage: 'Upload',
		description: 'Title of the navigation tab that allows users to upload local media files'
	},
	chooseFile: {
		id: 'fabric.editor.media.insert.chooseFile',
		defaultMessage: 'Choose a file',
		description: 'Text on a button that opens a file picker dialog to choose a local media file',
	}
});
