import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractPreview,
	extractSmartLinkEmbed,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractType,
	type LinkPreview,
} from '@atlaskit/link-extractors';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { getEmptyJsonLd } from '../../utils/jsonld';
import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { extractSmartLinkContext } from '../common/context';
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

	return {
		link: extractSmartLinkUrl(response) || '',
		title: extractSmartLinkTitle(response),
		context: extractSmartLinkContext(response),
		preview: fg('smart_links_noun_support')
			? extractSmartLinkEmbed(response, iframeUrlType)
			: extractEmbedPreview(jsonLd, platform, iframeUrlType),
		isTrusted: extractIsTrusted(meta),
		isSupportTheming: extractIsSupportTheming(meta),
		...(fg('platform-linking-visual-refresh-v2') && {
			type: extractType(jsonLd),
		}),
	};
};
