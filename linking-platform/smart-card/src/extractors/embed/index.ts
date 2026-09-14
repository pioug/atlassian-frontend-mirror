import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractSmartLinkEmbed } from '@atlaskit/link-extractors/extract-smart-link-embed';
import { extractSmartLinkTitle } from '@atlaskit/link-extractors/extract-smart-link-title';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import { extractType } from '@atlaskit/link-extractors/extract-type';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { getEmptyJsonLd } from '../../utils/get-empty-json-ld';
import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { extractSmartLinkContext } from './extract-smart-link-context';
import { extractIsSupportTheming } from '../common/meta/extractIsSupportTheming';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';

export const extractEmbedProps = (
	response?: SmartLinkResponse,
	_platform?: CardPlatform,
	iframeUrlType?: EmbedIframeUrlType,
): EmbedCardResolvedViewProps => {
	const meta = response?.meta;
	const jsonLd = (response?.data as JsonLd.Data.BaseData) || getEmptyJsonLd();

	return {
		link: extractSmartLinkUrl(response) || '',
		title: extractSmartLinkTitle(response),
		context: extractSmartLinkContext(response),
		preview: extractSmartLinkEmbed(response, iframeUrlType),
		isTrusted: extractIsTrusted(meta),
		isSupportTheming: extractIsSupportTheming(meta),
		type: extractType(jsonLd),
	};
};
