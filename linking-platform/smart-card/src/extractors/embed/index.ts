import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractEntityProvider,
	extractLink,
	extractPreview,
	extractProvider,
	extractProviderIcon,
	extractSmartLinkEmbed,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractTitle,
	extractUrlFromIconJsonLd,
	isEntityPresent,
	type LinkPreview,
	type LinkProvider,
} from '@atlaskit/link-extractors';
import { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { getEmptyJsonLd } from '../../utils/jsonld';
import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { prioritiseIcon } from '../common/icon';
import { extractIsSupportTheming } from '../common/meta/extractIsSupportTheming';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';

const extractEmbedPreview = (
	jsonLd: JsonLd.Data.BaseData,
	platform?: CardPlatform,
	iframeUrlType?: EmbedIframeUrlType,
): (LinkPreview & { src: string }) | undefined => {
	const preview = extractPreview(jsonLd, platform, iframeUrlType);
	if (preview && preview.src) {
		return { ...preview, src: preview.src };
	}
};

function generateContext(jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined {
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
 * We can migrate this to link extractors once we have deprecated JsonLd
 */
function extractSmartLinkContext(response?: SmartLinkResponse): LinkProvider | undefined {
	if (isEntityPresent(response)) {
		return extractEntityProvider(response);
	}

	return generateContext(response?.data as JsonLd.Data.BaseData);
}

export const extractEmbedProps = (
	response?: SmartLinkResponse,
	platform?: CardPlatform,
	iframeUrlType?: EmbedIframeUrlType,
): EmbedCardResolvedViewProps => {
	const meta = response?.meta;
	const jsonLd = (response?.data as JsonLd.Data.BaseData) || getEmptyJsonLd();

	if (fg('smart_links_noun_support')) {
		return {
			link: extractSmartLinkUrl(response) || '',
			title: extractSmartLinkTitle(response),
			context: extractSmartLinkContext(response),
			preview: extractSmartLinkEmbed(response, iframeUrlType),
			isTrusted: extractIsTrusted(meta),
			isSupportTheming: extractIsSupportTheming(meta),
		};
	}

	return {
		link: extractLink(jsonLd) || '',
		title: extractTitle(jsonLd),
		context: generateContext(jsonLd),
		preview: extractEmbedPreview(jsonLd, platform, iframeUrlType),
		isTrusted: extractIsTrusted(meta),
		isSupportTheming: extractIsSupportTheming(meta),
	};
};
