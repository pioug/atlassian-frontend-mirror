import { FlexibleUiDataContext } from './types';

/**
 * Returns true if preview data is available in the FlexibleUiDataContext
 * @param context is the FlexibleUiDataContext
 */
export const isFlexUiPreviewPresent = (
  context?: FlexibleUiDataContext,
): boolean => Boolean(context && context.preview);
