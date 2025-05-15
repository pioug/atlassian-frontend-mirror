import { type MediaDefinition, type MediaADFAttrs } from '@atlaskit/adf-schema';

export const media = (attrs: MediaADFAttrs): MediaDefinition => ({
	type: 'media',
	attrs,
});
