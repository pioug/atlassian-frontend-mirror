import { JsonLd } from '@atlaskit/json-ld-types';
import {
	extractEntityProvider,
	extractProvider,
	extractProviderIcon,
	extractUrlFromIconJsonLd,
	isEntityPresent,
	LinkProvider,
} from '@atlaskit/link-extractors';
import { SmartLinkResponse } from '@atlaskit/linking-types';

import { prioritiseIcon } from '../icon/prioritiseIcon';

export { extractRequestAccessContextImproved } from './extractAccessContext';

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

/**
 * Should be moved to link-extractors when jsonLd is deprecated
 */
export function extractSmartLinkContext(response?: SmartLinkResponse): LinkProvider | undefined {
	if (isEntityPresent(response)) {
		return extractEntityProvider(response);
	}

	return generateContext(response?.data as JsonLd.Data.BaseData);
}
