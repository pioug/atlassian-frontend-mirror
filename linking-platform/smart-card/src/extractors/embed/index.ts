import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractLink,
	extractPreview,
	extractSmartLinkEmbed,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractTitle,
	extractType,
	type LinkPreview,
} from '@atlaskit/link-extractors';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { getEmptyJsonLd } from '../../utils/jsonld';
import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { extractSmartLinkContext, generateContext } from '../common/context';
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
			...(fg('platform-linking-visual-refresh-v2') && {
				type: extractType(jsonLd),
			}),
		};
	}

	return {
		link: extractLink(jsonLd) || '',
		title: extractTitle(jsonLd),
		context: generateContext(jsonLd),
		preview: extractEmbedPreview(jsonLd, platform, iframeUrlType),
		isTrusted: extractIsTrusted(meta),
		isSupportTheming: extractIsSupportTheming(meta),
		...(fg('platform-linking-visual-refresh-v2') && {
			type: extractType(jsonLd),
		}),
	};
};
