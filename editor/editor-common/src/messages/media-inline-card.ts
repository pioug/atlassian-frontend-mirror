import { defineMessages } from 'react-intl-next';
export const messages = defineMessages({
  unableToLoadContent: {
    id: 'fabric.editor.unableToLoadContent',
    defaultMessage: "We couldn't load this content",
    description:
      'Display this message when there is an error loading file content',
  },
  failedToUpload: {
    id: 'fabric.editor.failed_to_upload',
    defaultMessage: 'Failed to upload',
    description: 'Display this message when there is an error uploading a file',
  },
});
