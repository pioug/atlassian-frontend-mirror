import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractProvider } from '@atlaskit/link-extractors/extract-provider';
import { extractProviderIcon } from '@atlaskit/link-extractors/extract-provider-icon';
import { extractUrlFromIconJsonLd } from '@atlaskit/link-extractors/extract-url-from-icon-json-ld';
import type { LinkProvider } from '@atlaskit/link-extractors/types';

import { prioritiseIcon } from '../icon/prioritiseIcon';

export function generateContext(jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined {
	const provider = extractProvider(jsonLd);
	if (!provider) {
		return undefined;
	}

	// If no icon is supplied, return existing context
	if (!jsonLd.icon) {
		return provider;
	}

	const generator = jsonLd.generator;

	const icon: React.ReactNode = prioritiseIcon<React.ReactNode>({
		fileFormatIcon: undefined,
		documentTypeIcon: undefined,
		urlIcon: extractUrlFromIconJsonLd(jsonLd.icon),
		// We still attempt to follow the icon priority function even if no generator (and therefore provider icon) is defined
		providerIcon:
			generator &&
			typeof generator !== 'string' &&
			generator['@type'] !== 'Link' &&
			extractProviderIcon(generator.icon),
	});

	return {
		...provider,
		icon: icon ? icon : provider.icon,
	};
}
