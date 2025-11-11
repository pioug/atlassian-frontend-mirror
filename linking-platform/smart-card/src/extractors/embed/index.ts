import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractSmartLinkEmbed,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractType,
} from '@atlaskit/link-extractors';
import type { SmartLinkResponse } from '@atlaskit/linking-types';

import { getEmptyJsonLd } from '../../utils/jsonld';
import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { extractSmartLinkContext } from '../common/context';
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
