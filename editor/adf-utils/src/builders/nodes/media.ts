import type { MediaDefinition, MediaADFAttrs } from '@atlaskit/adf-schema/media';

export const media = (attrs: MediaADFAttrs): MediaDefinition => ({
	type: 'media',
	attrs,
});
