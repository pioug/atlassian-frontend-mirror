import { MediaDefinition, MediaAttributes } from '@atlaskit/adf-schema';

export const media = (attrs: MediaAttributes): MediaDefinition => ({
  type: 'media',
  attrs,
});
