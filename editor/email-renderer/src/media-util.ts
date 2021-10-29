import { MediaType } from './interfaces';

export const getIconFromMediaType = (mediaType: MediaType) => {
  switch (mediaType) {
    case 'archive':
      return 'archiveAttachment';
    case 'audio':
      return 'audioAttachment';
    case 'doc':
      return 'documentAttachment';
    case 'video':
      return 'videoAttachment';
    default:
      return 'genericAttachment';
  }
};
