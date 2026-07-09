import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	type EntityType,
	type ProviderGenerator,
	type SmartLinkResponse,
} from '@atlaskit/linking-types';
import {
	isBaseEntity,
	isDesignEntity,
	isDocumentEntity,
} from '@atlaskit/linking-types/entity-types';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { fg } from '@atlaskit/platform-feature-flags';

import { rebrandProvider } from './common/rebrand-provider';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from './constants';

/*
 * ###########################################################################
 * Generic extraction helpers
 * ###########################################################################
 *
 * Utilities for selecting extractor functions based on JSON-LD object type.
 */
export interface ExtractorFunction<T> {
	(json: any): T;
}

export interface ExtractOptions<T> {
	defaultExtractorFunction: ExtractorFunction<T>;
	extractorFunctionsByType: { [type: string]: ExtractorFunction<T> };
	extractorPrioritiesByType: { [type: string]: number };
	json: any;
}

export function genericExtractPropsFromJSONLD<T>(options: ExtractOptions<T>): T {
	const { defaultExtractorFunction, extractorPrioritiesByType, extractorFunctionsByType, json } =
		options;

	if (json) {
		const type = json['@type'];

		if (type && Array.isArray(type)) {
			let highestPriority = 0;
			let highestPriorityExtractorFunction = defaultExtractorFunction;
			for (let t of type) {
				if (extractorPrioritiesByType[t] > highestPriority) {
					highestPriority = extractorPrioritiesByType[t];
					highestPriorityExtractorFunction = extractorFunctionsByType[t];
				}
			}
			return highestPriorityExtractorFunction(json);
		}

		if (type && extractorFunctionsByType[type]) {
			return extractorFunctionsByType[type](json);
		}
	}

	return defaultExtractorFunction(json);
}

/*
 * ###########################################################################
 * Shared public types
 * ###########################################################################
 *
 * Types that are shared across multiple extraction groups.
 */
export type CardPlatform = JsonLd.Primitives.Platforms;

/*
 * ###########################################################################
 * URL extraction
 * ###########################################################################
 *
 * Helpers for normalising JSON-LD Link and Image URL shapes into strings.
 */
export const extractUrlFromLinkJsonLd = (
	link: JsonLd.Primitives.Link | JsonLd.Primitives.Link[],
): string | undefined => {
	if (typeof link === 'string') {
		return link;
	} else if (Array.isArray(link)) {
		if (link.length > 0) {
			return extractUrlFromLinkJsonLd(link[0]);
		}
	} else {
		return link.href;
	}
	return undefined;
};

export const extractUrlFromIconJsonLd = (
	icon: JsonLd.Primitives.Link | JsonLd.Primitives.Image,
): string | undefined => {
	if (typeof icon === 'string') {
		return icon;
	} else if (icon['@type'] === 'Link') {
		return extractUrlFromLinkJsonLd(icon);
	} else {
		if (icon.url) {
			return extractUrlFromLinkJsonLd(icon.url);
		}
	}
	return undefined;
};

/*
 * ###########################################################################
 * Primitive JSON-LD extraction
 * ###########################################################################
 *
 * Low-level extractors for scalar values and JSON-LD primitive metadata.
 */
export const extractType = (
	jsonLd: JsonLd.Primitives.Object,
): JsonLd.Primitives.ObjectType[] | undefined => {
	const type = jsonLd['@type'];
	if (type) {
		if (Array.isArray(jsonLd['@type'])) {
			return type as JsonLd.Primitives.ObjectType[];
		} else {
			return [type as JsonLd.Primitives.ObjectType];
		}
	}
	return undefined;
};

export const extractAri = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (jsonLd['atlassian:ari']) {
		return jsonLd['atlassian:ari'];
	}
	return undefined;
};

/**
 * @deprecated Use extractSmartLinkUrl instead
 */
export const extractLink = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	const url = jsonLd?.url;
	if (url) {
		if (typeof url === 'string') {
			return url;
		} else {
			return extractUrlFromLinkJsonLd(url);
		}
	}
	return undefined;
};

export const extractSummary = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (typeof jsonLd?.summary === 'string') {
		const summary = jsonLd.summary.trim();
		return Boolean(summary) ? summary : undefined;
	}
	return undefined;
};

/**
 * @deprecated Use extractSmartLinkTitle instead
 */
export const extractTitle = (
	jsonLd: JsonLd.Data.BaseData,
	removeTextHighlightingFromTitle?: boolean,
): string | undefined => {
	if (!jsonLd) {
		return undefined;
	}

	const name = jsonLd.name?.replace(/[\r\n]+/g, '');
	const id = jsonLd['@id'] || '';

	// Check if this is a reference to something _inside_ a Repository.
	// We format these titles to represent more metadata.
	const context = extractContext(jsonLd);
	const type = extractType(jsonLd);
	const hasContextType = context && context.type;
	const hasContextRepo =
		hasContextType && context!.type!.includes('atlassian:SourceCodeRepository');
	if (hasContextRepo && type) {
		const contextName = (context!.name && `${context!.name}: `) || '';
		// COMMIT: `repo-name: abf137c title of commit message`
		if (type.includes('atlassian:SourceCodeCommit')) {
			const [, hashContent] = id.split(':');
			const hash = hashContent && `${hashContent.substring(0, 8)} `;
			return contextName + (hash || '') + name;
		}
		// PR: `repo-name: #42 title of pull request`
		if (type.includes('atlassian:SourceCodePullRequest')) {
			const pullRequest = jsonLd as JsonLd.Data.SourceCodePullRequest;
			const internalId = pullRequest['atlassian:internalId'];
			const internalIdRef = internalId && `#${internalId} `;
			return contextName + (internalIdRef || '') + name;
		}
		// BRANCH: `repo-name/branch-name`
		if (type.includes('atlassian:SourceCodeReference')) {
			return contextName + name;
		}

		// FILE: `repo-name: filepath`
		if (type.includes('schema:DigitalDocument')) {
			return contextName + name;
		}
	}

	if (removeTextHighlightingFromTitle) {
		const textFragmentRegex = new RegExp(' \\| :~:text=.*', 'g');
		const truncated = name?.replace(textFragmentRegex, '');
		return truncated;
	}

	return name;
};

export const extractNameFromJsonLd = (details?: JsonLd.Response): string | undefined =>
	(details?.data && 'name' in details.data && details.data.name) || undefined;

/*
 * ###########################################################################
 * Provider and context extraction
 * ###########################################################################
 *
 * Extractors for JSON-LD context and generator/provider metadata.
 */
interface LinkContext {
	icon?: string;
	name: string;
	type?: JsonLd.Primitives.ObjectType[];
}

export const extractContext = (jsonLd: JsonLd.Data.BaseData): LinkContext | undefined => {
	const context = jsonLd.context;
	if (context) {
		if (typeof context === 'string') {
			return { name: context };
		} else if (context['@type'] === 'Link') {
			if (context.name) {
				return { name: context.name };
			}
		} else {
			if (context.name) {
				return {
					name: context.name,
					icon: context.icon && extractUrlFromIconJsonLd(context.icon),
					type: extractType(context),
				};
			}
		}
	}
	return undefined;
};

export interface LinkProvider {
	icon?: React.ReactNode;
	iconLabel?: string;
	id?: string;
	image?: string;
	text: string;
}

/**
 * @deprecated Use extractSmartLinkProvider instead
 */
export const extractProvider = (jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined => {
	const generator = jsonLd.generator;
	if (generator) {
		if (typeof generator === 'string') {
			throw Error('Link.generator requires a name and icon.');
		} else if (generator['@type'] === 'Link') {
			if (generator.name) {
				return fg('platform_sl_google_rebrand')
					? rebrandProvider({ text: generator.name })
					: { text: generator.name };
			}
		} else {
			if (generator.name) {
				const id = generator['@id'];

				return fg('platform_sl_google_rebrand')
					? rebrandProvider({
							text: generator.name,
							icon: extractProviderIcon(generator.icon, id),
							...(fg('platform_lp_use_entity_icon_url_for_icon')
								? { iconLabel: generator.name }
								: undefined),
							id,
							image: extractProviderImage(generator.image),
						})
					: {
							text: generator.name,
							icon: extractProviderIcon(generator.icon, id),
							...(fg('platform_lp_use_entity_icon_url_for_icon')
								? { iconLabel: generator.name }
								: undefined),
							id,
							image: extractProviderImage(generator.image),
						};
			}
		}
	}
	return undefined;
};

export const extractProviderIcon = (
	icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
	id?: string,
): React.ReactNode | undefined => {
	if (id) {
		if (id === CONFLUENCE_GENERATOR_ID) {
			return (
				<ConfluenceIcon
					appearance="brand"
					size="xxsmall"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
			);
		} else if (id === JIRA_GENERATOR_ID) {
			return (
				<JiraIcon
					appearance="brand"
					size="xxsmall"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
			);
		}
	}
	if (icon) {
		return extractUrlFromIconJsonLd(icon);
	}
	return undefined;
};

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

export const isConfluenceGenerator = (
	id: string,
): id is 'https://www.atlassian.com/#Confluence' => {
	return id === CONFLUENCE_GENERATOR_ID;
};

/*
 * ###########################################################################
 * Date extraction
 * ###########################################################################
 *
 * Extractors for created, updated, and viewed date metadata.
 */
export type LinkTypeCreated =
	| JsonLd.Data.Document
	| JsonLd.Data.Page
	| JsonLd.Data.Project
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType;

export const extractDateCreated = (jsonLd: LinkTypeCreated): string | undefined => {
	if (jsonLd['schema:dateCreated']) {
		return jsonLd['schema:dateCreated'];
	}
	return undefined;
};

export const extractDateUpdated = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	if (jsonLd.updated) {
		return jsonLd.updated;
	}
	return undefined;
};

export const extractDateViewed = (jsonLd: JsonLd.Data.Document): string | undefined => {
	if (jsonLd['atlassian:dateViewed']) {
		return jsonLd['atlassian:dateViewed'];
	}
	return undefined;
};

/*
 * ###########################################################################
 * People extraction
 * ###########################################################################
 *
 * Extractors for JSON-LD people, owners, members, assignees, creators, and updaters.
 */
export interface LinkPerson {
	name: string;
	src?: string;
}

export const extractPersonFromJsonLd = (
	person: JsonLd.Primitives.Object | JsonLd.Primitives.Link,
): LinkPerson | undefined => {
	if (typeof person === 'string') {
		throw Error('Link.person needs to be an object.');
	} else if (person['@type'] === 'Link') {
		if (person.name) {
			return { name: person.name };
		}
	} else {
		if (person.name) {
			return {
				name: person.name,
				src: person.icon && extractUrlFromIconJsonLd(person.icon),
			};
		}
	}
	return undefined;
};

export const extractMembers = (jsonLd: JsonLd.Data.Project): LinkPerson[] | undefined => {
	const members = jsonLd['atlassian:member'];
	if (members) {
		if (typeof members === 'string') {
			throw Error('Link[atlassian:members] must be an array or object.');
		} else if (members.hasOwnProperty('totalItems')) {
			const collection = members as JsonLd.Primitives.Collection<JsonLd.Primitives.Person>;
			if (collection.items) {
				return (collection.items as JsonLd.Primitives.Person[])
					.map((member) => extractPersonFromJsonLd(member))
					.filter((member) => !!member) as LinkPerson[];
			}
		} else {
			const memberItem = members as JsonLd.Primitives.Link | JsonLd.Primitives.Person;
			const memberItemForLink = extractPersonFromJsonLd(memberItem);
			if (memberItemForLink) {
				return [memberItemForLink];
			}
		}
	}
	return undefined;
};

type LinkTypeAssignedTo = JsonLd.Data.Task | JsonLd.Data.TaskType;

export const extractPersonAssignedTo = (jsonLd: LinkTypeAssignedTo): LinkPerson | undefined => {
	const assignedTo = jsonLd['atlassian:assignedTo'];
	if (assignedTo) {
		return extractPersonFromJsonLd(assignedTo);
	}
	return undefined;
};

export const extractPersonCreatedBy = (jsonLd: JsonLd.Data.BaseData): LinkPerson[] | undefined => {
	const attributedTo = jsonLd.attributedTo;
	if (attributedTo) {
		if (Array.isArray(attributedTo)) {
			return attributedTo.map(extractPersonFromJsonLd).filter((item) => !!item) as LinkPerson[];
		} else {
			const item = extractPersonFromJsonLd(attributedTo);
			if (item) {
				return [item];
			}
		}
	}
	return undefined;
};

export const extractPersonOwnedBy = (jsonLd: JsonLd.Data.BaseData): LinkPerson[] | undefined => {
	const ownedBy = jsonLd['atlassian:ownedBy'];
	if (ownedBy) {
		if (Array.isArray(ownedBy)) {
			return ownedBy.map(extractPersonFromJsonLd).filter((item) => !!item) as LinkPerson[];
		} else {
			const item = extractPersonFromJsonLd(ownedBy);
			if (item) {
				return [item];
			}
		}
	}
	return undefined;
};

export type LinkPersonUpdatedBy = Array<LinkPerson>;
export type LinkTypeUpdatedBy =
	| JsonLd.Data.Document
	| JsonLd.Data.Project
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task;

export const extractPersonUpdatedBy = (jsonLd: LinkTypeUpdatedBy): LinkPerson | undefined => {
	const updatedBy = jsonLd['atlassian:updatedBy'];
	if (updatedBy) {
		return extractPersonFromJsonLd(updatedBy as JsonLd.Primitives.Object | JsonLd.Primitives.Link);
	}
	return undefined;
};

/*
 * ###########################################################################
 * Preview extraction
 * ###########################################################################
 *
 * Extractors for preview, embed, image, and platform support metadata.
 */
export const extractImage = (jsonLd: JsonLd.Data.BaseData): string | undefined => {
	const image = jsonLd.image;
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

export const extractPlatformIsSupported = (
	preview: JsonLd.Data.BaseData['preview'],
	platform?: CardPlatform,
): boolean | undefined => {
	if (preview) {
		// By default, we support previews everywhere.
		if (typeof preview === 'string') {
			return true;
		} else {
			const supportedPlatforms = preview['atlassian:supportedPlatforms'];
			if (supportedPlatforms) {
				const isWeb = platform === 'web';
				return (
					(isWeb && supportedPlatforms.includes('web')) ||
					(!isWeb && supportedPlatforms.includes('mobile'))
				);
			}
			// No supported platforms - assume they are all supported.
			return true;
		}
	}

	// No preview, don't try and render it on any platforms.
	return false;
};

export interface LinkPreview {
	aspectRatio?: number;
	content?: string;
	src?: string;
}

type EmbedIframeUrlType = 'href' | 'interactiveHref';

/**
 * @deprecated Please use extractEmbed instead
 */
export const extractPreview = (
	jsonLd?: JsonLd.Data.BaseData,
	platform?: CardPlatform,
	iframeUrlType?: EmbedIframeUrlType,
): LinkPreview | undefined => {
	const preview = jsonLd?.preview;
	const isSupported = extractPlatformIsSupported(preview, platform);
	if (preview && isSupported) {
		if (typeof preview === 'string') {
			return { src: preview };
		} else if (
			preview['@type'] === 'Link' &&
			iframeUrlType === 'interactiveHref' &&
			preview.interactiveHref
		) {
			return {
				src: preview.interactiveHref,
				aspectRatio: preview['atlassian:aspectRatio'],
			};
		} else if (preview['@type'] === 'Link') {
			return {
				src: extractUrlFromLinkJsonLd(preview),
				aspectRatio: preview['atlassian:aspectRatio'],
			};
		} else {
			// TODO, EDM-565: Remove this once the typings for Dropbox and Jira have been patched up.
			if (preview.url || (preview as any).href) {
				if (iframeUrlType === 'interactiveHref' && preview.interactiveHref) {
					return {
						src: preview.interactiveHref,
						aspectRatio: preview['atlassian:aspectRatio'],
					};
				}
				return {
					src: extractUrlFromLinkJsonLd(preview.url || (preview as any).href),
					aspectRatio: preview['atlassian:aspectRatio'],
				};
			} else if (preview.content) {
				return { content: preview.content };
			}
		}
	}
	return undefined;
};

/*
 * ###########################################################################
 * Entity extraction
 * ###########################################################################
 *
 * Extractors for Smart Link entity data and entity-backed provider metadata.
 */
export const extractEntity = (response?: SmartLinkResponse): EntityType | undefined =>
	response?.entityData;

export const isEntityPresent = (response?: SmartLinkResponse): boolean =>
	Boolean(extractEntity(response));

const extractEntityEmbedUrl = (response?: SmartLinkResponse): string | undefined => {
	const entity = extractEntity(response);
	return entity && 'liveEmbedUrl' in entity && typeof entity?.liveEmbedUrl === 'string'
		? entity?.liveEmbedUrl
		: undefined;
};

export const extractEntityProvider = (response?: SmartLinkResponse): LinkProvider | undefined => {
	if (!response?.meta?.generator) {
		return undefined;
	}

	if (fg('platform_lp_use_entity_icon_url_for_icon')) {
		const entityIcon = extractEntityIcon(response);
		if (entityIcon) {
			return fg('platform_sl_google_rebrand')
				? rebrandProvider({
						text: response.meta.generator.name,
						icon: entityIcon.url,
						id: response.meta.generator.id,
						image: entityIcon.url,
						iconLabel: entityIcon.label,
					})
				: {
						text: response.meta.generator.name,
						icon: entityIcon.url,
						id: response.meta.generator.id,
						image: entityIcon.url,
						iconLabel: entityIcon.label,
					};
		}
	}

	const { icon, id, image, name } = response.meta.generator as ProviderGenerator;
	if (!name || !icon) {
		throw Error('Link.generator requires a name and icon.');
	}

	let providerIcon;
	switch (id) {
		case CONFLUENCE_GENERATOR_ID:
			providerIcon = (
				<ConfluenceIcon
					appearance="brand"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
					size="xxsmall"
				/>
			);
			break;
		case JIRA_GENERATOR_ID:
			providerIcon = (
				<JiraIcon
					appearance="brand"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
					size="xxsmall"
				/>
			);
			break;
		default:
			providerIcon = icon.url;
	}

	return fg('platform_sl_google_rebrand')
		? rebrandProvider({
				text: name,
				icon: providerIcon,
				id,
				image: image ? image : icon.url,
				...(fg('platform_lp_use_entity_icon_url_for_icon') ? { iconLabel: name } : undefined),
			})
		: {
				text: name,
				icon: providerIcon,
				id,
				image: image ? image : icon.url,
				...(fg('platform_lp_use_entity_icon_url_for_icon') ? { iconLabel: name } : undefined),
			};
};

export const extractEntityIcon = (
	response?: SmartLinkResponse,
):
	| {
			label: string | undefined;
			url: string | undefined;
	  }
	| undefined => {
	if (fg('platform_lp_use_entity_icon_url_for_icon')) {
		const entity = extractEntity(response);
		if (!entity) {
			return undefined;
		}

		if (!isBaseEntity(entity)) {
			return undefined;
		}

		if (isDesignEntity(entity) && entity.iconUrl) {
			return {
				url: entity.iconUrl,
				label: entity.type,
			};
		}

		if (isDocumentEntity(entity) && entity.type.iconUrl) {
			return {
				url: entity.type.iconUrl,
				label: entity.type.category,
			};
		}

		// When JSON-LD is deprecated, we can change this to returning entity provider icon.
		// For now code upstream will return better result when this method returns undefined.
		return undefined;
	} else {
		const entity = extractEntity(response);

		let url: string | undefined;
		if (entity) {
			url =
				'iconUrl' in entity && typeof entity?.iconUrl === 'string'
					? entity.iconUrl
					: response?.meta.generator?.icon?.url;
		}

		return {
			url,
			label: entity?.displayName,
		};
	}
};

/*
 * ###########################################################################
 * Smart Link response extraction
 * ###########################################################################
 *
 * High-level extractors for SmartLinkResponse objects, preferring entity data with JSON-LD fallbacks.
 */
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
		return extractEntity(response)?.ari || extractEntity(response)?.thirdPartyAri;
	}

	const data = response?.data as JsonLd.Data.BaseData;
	return extractAri(data);
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

export const extractSmartLinkProvider = (
	response?: SmartLinkResponse,
): LinkProvider | undefined => {
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
		return extractEntity(response)?.createdBy?.displayName;
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

	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		const owners = entity?.owners;

		if (owners) {
			return owners
				.map((owner) => ({ name: owner.displayName, src: owner.picture }))
				.filter((item) => !!item) as LinkPerson[];
		}
	}

	return extractPersonCreatedBy(response.data as JsonLd.Data.BaseData);
};

export const extractSmartLinkModifiedBy = (response?: SmartLinkResponse): string | undefined => {
	if (!response || !response.data) {
		return undefined;
	}

	if (isEntityPresent(response)) {
		return extractEntity(response)?.lastUpdatedBy?.displayName;
	}

	const person = extractPersonUpdatedBy(response.data as LinkTypeUpdatedBy);
	return person ? person.name : undefined;
};

export const extractSmartLinkDownloadUrl = (response?: SmartLinkResponse): string | undefined => {
	if (isEntityPresent(response)) {
		const entity = extractEntity(response);
		return entity &&
			'exportLinks' in entity &&
			Array.isArray(entity.exportLinks) &&
			entity.exportLinks.length > 0
			? entity?.exportLinks?.[0].url
			: undefined;
	}
	return (response?.data as JsonLd.Data.BaseData)?.['atlassian:downloadUrl'];
};
