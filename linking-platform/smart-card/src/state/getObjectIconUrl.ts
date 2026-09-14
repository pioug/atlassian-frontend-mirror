import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

/**
 * @deprecated Use extractUrlFromIconJsonLd from @atlaskit/link-extractors instead
 */
export const getObjectIconUrl = (details?: JsonLd.Response): string | undefined => {
	if (details?.data && 'icon' in details.data && details.data.icon) {
		if (
			typeof details.data.icon === 'object' &&
			'url' in details.data.icon &&
			details.data.icon.url &&
			typeof details.data.icon.url === 'string'
		) {
			return details.data.icon.url;
		}
	}
	return undefined;
};
