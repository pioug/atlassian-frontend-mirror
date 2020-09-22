import {
  MediaSingleDefinition,
  MediaDefinition,
  RichMediaAttributes as MediaSingleAttributes,
  CaptionDefinition,
} from '@atlaskit/adf-schema';

export const mediaSingle = (attrs: MediaSingleAttributes | undefined) => (
  content:
    | MediaDefinition
    | [MediaDefinition]
    | [MediaDefinition, CaptionDefinition],
): MediaSingleDefinition => ({
  type: 'mediaSingle',
  attrs,
  content: Array.isArray(content) ? content : [content],
});
