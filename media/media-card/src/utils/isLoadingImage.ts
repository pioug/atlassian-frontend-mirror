import { MediaType } from '@atlaskit/media-client';

export const isLoadingImage = (
  mediaType?: MediaType,
  dataURI?: string,
): boolean => {
  return mediaType === 'image' && !dataURI;
};
