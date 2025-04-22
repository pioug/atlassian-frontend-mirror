export interface ExtractorFunction<T> {
	(json: any): T;
}

export interface ExtractOptions<T> {
	defaultExtractorFunction: ExtractorFunction<T>;
	extractorPrioritiesByType: { [type: string]: number };
	extractorFunctionsByType: { [type: string]: ExtractorFunction<T> };
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

export {
	extractPlatformIsSupported,
	extractContext,
	extractProvider,
	extractProviderIcon,
	extractDateCreated,
	extractDateUpdated,
	extractDateViewed,
	extractMembers,
	extractPersonAssignedTo,
	extractPersonOwnedBy,
	extractPersonCreatedBy,
	extractPersonUpdatedBy,
	extractPersonFromJsonLd,
	extractImage,
	extractPreview,
	extractLink,
	extractTitle,
	extractSummary,
	extractType,
	extractUrlFromIconJsonLd,
	extractUrlFromLinkJsonLd,
	extractAri,
	isConfluenceGenerator,
} from './common';

export { extractEntity, extractEntityProvider, isEntityPresent } from './entity';
export {
	extractSmartLinkEmbed,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractSmartLinkIcon,
	extractSmartLinkProvider,
} from './smart-link';

export type {
	LinkPerson,
	LinkProvider,
	LinkTypeCreated,
	LinkPersonUpdatedBy,
	LinkTypeUpdatedBy,
	LinkPreview,
} from './common';
export type { CardPlatform } from './types';
