import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractEntityProvider,
	extractLink,
	extractProvider,
	// extractSmartLinkIcon,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
	extractTitle,
	isEntityPresent,
} from '@atlaskit/link-extractors';
import { type CardProviderRenderers } from '@atlaskit/link-provider';
import { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

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

const extractSmartLinkInlineIcon = (response?: SmartLinkResponse, showLabel = true) => {
	if (isEntityPresent(response)) {
		const provider = extractEntityProvider(response);
		if (provider) {
			return provider.icon;
		}
		// We don't need this for design entities,
		// but we can add it back when we support more nouns
		// it requires extractInlineIcon to be moved to the smart link extractor package.
		// see: https://product-fabric.atlassian.net/browse/EDM-12375
		// return extractSmartLinkIcon(response);
	}

	return extractInlineIcon(response?.data as JsonLd.Data.BaseData, showLabel);
};

export const extractInlineProps = (
	response?: SmartLinkResponse,
	renderers?: CardProviderRenderers,
	removeTextHighlightingFromTitle?: boolean,
	showLabel = true,
): InlineCardResolvedViewProps => {
	const jsonLd = response?.data as JsonLd.Data.BaseData;

	if (fg('smart_links_noun_support')) {
		return {
			icon: extractSmartLinkInlineIcon(response, showLabel),
			link: extractSmartLinkUrl(response),
			title: extractSmartLinkTitle(response, removeTextHighlightingFromTitle),
			// As we migrate to support more nouns we can incorporate these fields
			lozenge: extractLozenge(jsonLd),
			titleTextColor: extractTitleTextColor(jsonLd),
			titlePrefix: extractTitlePrefix(jsonLd, renderers, 'inline'),
		};
	}

	return {
		link: extractLink(jsonLd),
		title: extractTitle(jsonLd, removeTextHighlightingFromTitle),
		lozenge: extractLozenge(jsonLd),
		icon: extractInlineIcon(jsonLd, showLabel),
		titleTextColor: extractTitleTextColor(jsonLd),
		titlePrefix: extractTitlePrefix(jsonLd, renderers, 'inline'),
	};
};
