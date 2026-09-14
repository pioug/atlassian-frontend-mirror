import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { rebrandProvider } from './common/rebrand-provider';
import { extractProviderIcon } from './extract-provider-icon';
import { extractUrlFromLinkJsonLd } from './extract-url-from-link-json-ld';
import type { LinkProvider } from './types';

const extractProviderImage = (
	image?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
): string | undefined => {
	if (image) {
		if (typeof image === 'string') {
			return image;
		} else if (image['@type'] === 'Link') {
			return extractUrlFromLinkJsonLd(image);
		} else if (image['@type'] === 'Image') {
			if (image.url) {
				return extractUrlFromLinkJsonLd(image.url);
			}
		}
	}
	return undefined;
};

/**
 * @deprecated Use `import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider'` instead.
 */
export const extractProvider = (jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined => {
	const generator = jsonLd.generator;
	if (generator) {
		if (typeof generator === 'string') {
			throw Error('Link.generator requires a name and icon.');
		} else if (generator['@type'] === 'Link') {
			if (generator.name) {
				return rebrandProvider({ text: generator.name });
			}
		} else {
			if (generator.name) {
				const id = generator['@id'];

				return rebrandProvider({
					text: generator.name,
					icon: extractProviderIcon(generator.icon, id),
					...{ iconLabel: generator.name },
					id,
					image: extractProviderImage(generator.image),
				});
			}
		}
	}
	return undefined;
};
