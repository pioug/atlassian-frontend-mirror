import type { ExternalMediaAttributes, MediaADFAttrs } from '@atlaskit/adf-schema';

export const isExternalMedia = (attrs: MediaADFAttrs): attrs is ExternalMediaAttributes => {
	return attrs.type === 'external';
};
