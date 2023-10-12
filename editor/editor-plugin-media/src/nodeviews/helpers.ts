import type { MediaAttributes } from '@atlaskit/adf-schema';

export const hasPrivateAttrsChanged = (
  currentAttrs: MediaAttributes,
  newAttrs: Partial<MediaAttributes>,
): boolean => {
  return (
    currentAttrs.__fileName !== newAttrs.__fileName ||
    currentAttrs.__fileMimeType !== newAttrs.__fileMimeType ||
    currentAttrs.__fileSize !== newAttrs.__fileSize ||
    currentAttrs.__contextId !== newAttrs.__contextId
  );
};
