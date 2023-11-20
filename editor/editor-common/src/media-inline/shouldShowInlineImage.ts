import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const shouldShowInlineImage = (mediaType: string) => {
  if (getBooleanFF('platform.editor.media.inline-image.base-support')) {
    return mediaType === 'image';
  }

  return false;
};
