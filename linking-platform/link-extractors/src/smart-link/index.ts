import { type JsonLd } from '@atlaskit/json-ld-types';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	extractAri,
	extractDateCreated,
	extractDateUpdated,
	extractLink,
	extractPersonCreatedBy,
	extractPersonUpdatedBy,
	extractProvider,
	extractTitle,
	type LinkPerson,
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
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.displayName;
		}
	}
	return extractTitle(response?.data as JsonLd.Data.BaseData, removeTextHighlightingFromTitle);
};

export const extractSmartLinkUrl = (response?: SmartLinkResponse): string | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.url;
		}
	}

	return extractLink(response?.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkAri = (response?: SmartLinkResponse): string | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.ari || extractEntity(response)?.thirdPartyAri;
		}
	}

	const data = response?.data as JsonLd.Data.BaseData;
	return extractAri(data);
};

export const extractSmartLinkEmbed = (
	response?: SmartLinkResponse,
	iframeUrlType?: EmbedIframeUrlType,
): LinkPreview | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			// TODO: Missing iframeUrlType
			const embedUrl = extractEntityEmbedUrl(response);
			return embedUrl ? { src: embedUrl } : undefined;
		}
	}

	return extractPreview(response?.data as JsonLd.Data.BaseData, 'web', iframeUrlType);
};

export const extractSmartLinkProvider = (response?: SmartLinkResponse) => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntityProvider(response);
		}
	}

	return response?.data && extractProvider(response?.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkCreatedOn = (response?: SmartLinkResponse): string | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.createdAt;
		}
	}

	return response?.data && extractDateCreated(response.data as LinkTypeCreated);
};

export const extractSmartLinkModifiedOn = (response?: SmartLinkResponse): string | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.lastUpdatedAt;
		}
	}

	return response?.data && extractDateUpdated(response.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkCreatedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.createdBy?.displayName;
		}
	}

	const persons = extractPersonCreatedBy(response.data as JsonLd.Data.BaseData);
	return !!persons?.length ? persons[0].name : undefined;
};

export const extractSmartLinkAuthorGroup = (
	response: SmartLinkResponse,
): LinkPerson[] | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			const entity = extractEntity(response);
			const owners = entity?.owners;

			if (owners) {
				return owners
					.map((owner) => ({ name: owner.displayName, src: owner.picture }))
					.filter((item) => !!item) as LinkPerson[];
			}
		}
	}

	return extractPersonCreatedBy(response.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkModifiedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			return extractEntity(response)?.lastUpdatedBy?.displayName;
		}
	}

	const person = extractPersonUpdatedBy(response.data as LinkTypeUpdatedBy);
	return person ? person.name : undefined;
};

export const extractSmartLinkDownloadUrl = (response?: SmartLinkResponse): string | undefined => {
	if (fg('smart_links_noun_support')) {
		if (isEntityPresent(response)) {
			const entity = extractEntity(response);
			return entity &&
				'exportLinks' in entity &&
				Array.isArray(entity.exportLinks) &&
				entity.exportLinks.length > 0
				? entity?.exportLinks?.[0].url
				: undefined;
		}
	}
	return (response?.data as JsonLd.Data.BaseData)?.['atlassian:downloadUrl'];
};
