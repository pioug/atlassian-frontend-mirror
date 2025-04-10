import { type JsonLd } from '@atlaskit/json-ld-types';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

import { extractTitle } from '../common';
import {
	type EmbedIframeUrlType,
	extractPreview,
	type LinkPreview,
} from '../common/preview/extractPreview';
import { extractEntityEmbedUrl, extractEntityTitle, isEntityType } from '../entity';

export const extractSmartLinkEmbed = (
	response?: SmartLinkResponse,
	iframeUrlType?: EmbedIframeUrlType,
): LinkPreview | undefined => {
	if (isEntityType(response)) {
		const embedUrl = extractEntityEmbedUrl(response);
		return embedUrl ? { src: embedUrl } : undefined;
	}

	return extractPreview(response?.data as JsonLd.Data.BaseData, 'web', iframeUrlType);
};

export const extractSmartLinkTitle = (
	response?: SmartLinkResponse,
	removeTextHighlightingFromTitle?: boolean,
): string | undefined => {
	if (isEntityType(response)) {
		return extractEntityTitle(response);
	}
	return extractTitle(response?.data as JsonLd.Data.BaseData, removeTextHighlightingFromTitle);
};
