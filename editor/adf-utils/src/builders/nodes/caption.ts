import { CaptionDefinition } from '@atlaskit/adf-schema';

export const caption = (
  ...content: CaptionDefinition['content']
): CaptionDefinition => ({
  type: 'caption',
  content,
});
