import { MediaType } from '@atlaskit/media-client';

export const shouldDisplayImageThumbnail = (
  dataURI?: string,
  mediaType?: MediaType,
): dataURI is string => {
  return !!(mediaType !== 'doc' && dataURI);
};
