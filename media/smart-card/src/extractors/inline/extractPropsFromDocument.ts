import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractInlineViewPropsFromObject } from './extractPropsFromObject';

// This extractor doesn't currently recognise any subclass fields
// - to be added in the near future.
export const extractInlineViewPropsFromDocument = (
  json: any,
): InlineCardResolvedViewProps => extractInlineViewPropsFromObject(json);
