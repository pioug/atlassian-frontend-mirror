import type { ExternalMediaAttributes, MediaADFAttrs } from '@atlaskit/adf-schema/media';

export const isExternalMedia = (attrs: MediaADFAttrs): attrs is ExternalMediaAttributes => {
	return attrs.type === 'external';
};
