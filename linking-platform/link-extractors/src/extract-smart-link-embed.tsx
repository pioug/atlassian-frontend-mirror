import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { extractEntity } from './extract-entity';
import { extractPreview } from './extract-preview';
import { isEntityPresent } from './is-entity-present';
import type { EmbedIframeUrlType, LinkPreview } from './types';

const extractEntityEmbedUrl = (response?: SmartLinkResponse): string | undefined => {
	const entity = extractEntity(response);
	return entity && 'liveEmbedUrl' in entity && typeof entity?.liveEmbedUrl === 'string'
		? entity?.liveEmbedUrl
		: undefined;
};

export const extractSmartLinkEmbed = (
	response?: SmartLinkResponse,
	iframeUrlType?: EmbedIframeUrlType,
): LinkPreview | undefined => {
	if (isEntityPresent(response)) {
		// TODO: Missing iframeUrlType
		const embedUrl = extractEntityEmbedUrl(response);
		return embedUrl ? { src: embedUrl } : undefined;
	}

	return extractPreview(response?.data as JsonLd.Data.BaseData, 'web', iframeUrlType);
};
