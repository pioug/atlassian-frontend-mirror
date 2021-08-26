import {
  MediaInlineDefinition,
  MediaInlineAttributes,
} from '@atlaskit/adf-schema';

export const mediaInline = (
  attrs: MediaInlineAttributes,
): MediaInlineDefinition => ({
  type: 'mediaInline',
  attrs,
});
