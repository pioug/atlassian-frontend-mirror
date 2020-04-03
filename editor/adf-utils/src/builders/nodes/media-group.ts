import { MediaGroupDefinition, MediaDefinition } from '@atlaskit/adf-schema';

export const mediaGroup = (
  ...content: Array<MediaDefinition>
): MediaGroupDefinition => ({
  type: 'mediaGroup',
  content,
});
