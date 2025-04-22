import { type JsonLd } from '@atlaskit/json-ld-types';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

import { extractLink, extractProvider, extractTitle } from '../common';
import {
	type EmbedIframeUrlType,
	extractPreview,
	type LinkPreview,
} from '../common/preview/extractPreview';
import {
	extractEntity,
	extractEntityEmbedUrl,
	extractEntityProvider,
	extractEntityTitle,
	instanceOfDesignEntity,
	isEntityPresent,
} from '../entity';

export const extractSmartLinkEmbed = (
	response?: SmartLinkResponse,
	iframeUrlType?: EmbedIframeUrlType,
): LinkPreview | undefined => {
	if (isEntityPresent(response)) {
		const embedUrl = extractEntityEmbedUrl(response);
		return embedUrl ? { src: embedUrl } : undefined;
	}

	return extractPreview(response?.data as JsonLd.Data.BaseData, 'web', iframeUrlType);
};

export const extractSmartLinkTitle = (
	response?: SmartLinkResponse,
	removeTextHighlightingFromTitle?: boolean,
): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntityTitle(response);
	}
	return extractTitle(response?.data as JsonLd.Data.BaseData, removeTextHighlightingFromTitle);
};

export const extractSmartLinkUrl = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.url;
	}

	return extractLink(response?.data as JsonLd.Data.BaseData);
};

/**
 * This funtions assumes that the response contains nounData.
 */
export const extractSmartLinkIcon = (response?: SmartLinkResponse) => {
	const entity = extractEntity(response);
	let url: string | undefined;

	if (instanceOfDesignEntity(entity)) {
		url = entity?.['atlassian:design'].iconUrl;
	}

	const label = extractEntityTitle(response);

	return {
		url,
		label,
	};
};

export const extractSmartLinkProvider = (response?: SmartLinkResponse) => {
	if (isEntityPresent(response)) {
		return extractEntityProvider(response);
	}

	return extractProvider(response?.data as JsonLd.Data.BaseData);
};
