import { defineMessages } from 'react-intl-next';

export const uploadRejectionFlagMessages = defineMessages({
  title: {
    id: 'fabric.media.uploadRejectionFlagTitle',
    defaultMessage: 'Your file failed to upload',
    description:
      'a title for a flag that describes that a file failed to upload',
  },
  description: {
    id: 'fabric.media.uploadRejectionFlagDescription',
    defaultMessage:
      '{fileName} is too big to upload. Files must be less than {limit}.',
    description:
      'a description for a flag that details why a file failed to upload',
  },
});
