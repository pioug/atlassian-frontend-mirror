import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractEntityProvider,
	extractProvider,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractType,
	isEntityPresent,
} from '@atlaskit/link-extractors';
import { type CardProviderRenderers } from '@atlaskit/link-provider';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { getEmptyJsonLd } from '../../utils/jsonld';
import { type InlineCardResolvedViewProps } from '../../view/InlineCard/ResolvedView';
import { extractIcon } from '../common/icon';
import { extractLozenge } from '../common/lozenge';
import { extractTitleTextColor } from '../common/primitives';
import { extractTitlePrefix } from '../common/title-prefix';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';

const extractInlineIcon = (jsonLd: JsonLd.Data.BaseData, showIconLabel = true) => {
	const provider = extractProvider(jsonLd);
	if (provider && provider.id) {
		if (provider.id === CONFLUENCE_GENERATOR_ID || provider.id === JIRA_GENERATOR_ID) {
			return extractIcon(jsonLd, 'type', showIconLabel);
		}
	}
	return extractIcon(jsonLd, 'provider', showIconLabel);
};

/**
 * Should be moved to the smart link-extractor when jsonld is deprecated
 */
const extractSmartLinkInlineIcon = (response?: SmartLinkResponse, showLabel = true) => {
	if (isEntityPresent(response)) {
		const provider = extractEntityProvider(response);
		if (provider) {
			return provider.icon;
		}
		// We don't need this for design entities,
		// but we can add it back when we support more entities
		// it requires extractInlineIcon to be moved to the smart link extractor package.
		// see: https://product-fabric.atlassian.net/browse/EDM-12375
		// return extractSmartLinkIcon(response);
	}

	return extractInlineIcon((response?.data as JsonLd.Data.BaseData) || getEmptyJsonLd(), showLabel);
};

export const extractInlineProps = (
	response?: SmartLinkResponse,
	renderers?: CardProviderRenderers,
	removeTextHighlightingFromTitle?: boolean,
	showLabel = true,
): InlineCardResolvedViewProps => {
	const jsonLd = (response?.data as JsonLd.Data.BaseData) || getEmptyJsonLd();

	return {
		link: extractSmartLinkUrl(response),
		title: extractSmartLinkTitle(response, removeTextHighlightingFromTitle),
		icon: extractSmartLinkInlineIcon(response, showLabel),
		// As we migrate to support more entities we can incorporate these fields
		lozenge: extractLozenge(jsonLd),
		titleTextColor: extractTitleTextColor(jsonLd),
		titlePrefix: extractTitlePrefix(jsonLd, renderers, 'inline'),
		...(fg('platform-linking-visual-refresh-v2') && {
			type: extractType(jsonLd),
		}),
	};
};
