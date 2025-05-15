import { type JsonLd } from '@atlaskit/json-ld-types';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

import {
	extractAri,
	extractDateCreated,
	extractDateUpdated,
	extractLink,
	extractPersonCreatedBy,
	extractPersonUpdatedBy,
	extractProvider,
	extractTitle,
	type LinkTypeCreated,
	type LinkTypeUpdatedBy,
} from '../common';
import {
	type EmbedIframeUrlType,
	extractPreview,
	type LinkPreview,
} from '../common/preview/extractPreview';
import {
	extractEntity,
	extractEntityEmbedUrl,
	extractEntityProvider,
	isEntityPresent,
} from '../entity';

export const extractSmartLinkTitle = (
	response?: SmartLinkResponse,
	removeTextHighlightingFromTitle?: boolean,
): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.displayName;
	}
	return extractTitle(response?.data as JsonLd.Data.BaseData, removeTextHighlightingFromTitle);
};

export const extractSmartLinkUrl = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.url;
	}

	return extractLink(response?.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkAri = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.ari;
	}

	const data = response?.data as JsonLd.Data.BaseData;
	return extractAri(data);
};

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

export const extractSmartLinkProvider = (response?: SmartLinkResponse) => {
	if (isEntityPresent(response)) {
		return extractEntityProvider(response);
	}

	return response?.data && extractProvider(response?.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkCreatedOn = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.createdAt;
	}

	return response?.data && extractDateCreated(response.data as LinkTypeCreated);
};

export const extractSmartLinkModifiedOn = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		return extractEntity(response)?.lastUpdatedAt;
	}

	return response?.data && extractDateUpdated(response.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkCreatedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.createdBy?.id;
	}

	const persons = extractPersonCreatedBy(response.data as JsonLd.Data.BaseData);
	return !!persons?.length ? persons[0].name : undefined;
};

export const extractSmartLinkModifiedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.lastUpdatedBy?.id;
	}

	const person = extractPersonUpdatedBy(response.data as LinkTypeUpdatedBy);
	return person ? person.name : undefined;
};
