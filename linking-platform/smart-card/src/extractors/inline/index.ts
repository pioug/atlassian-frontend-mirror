import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractEntityIcon } from '@atlaskit/link-extractors/extract-entity-icon';
import { extractEntityProvider } from '@atlaskit/link-extractors/extract-entity-provider';
import { extractProvider } from '@atlaskit/link-extractors/extract-provider';
import { extractSmartLinkInlineIcon as extractSmartLinkInlineIconFromLinkExtractors } from '@atlaskit/link-extractors/extract-smart-link-inline-icon';
import { extractSmartLinkTitle } from '@atlaskit/link-extractors/extract-smart-link-title';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import { extractType } from '@atlaskit/link-extractors/extract-type';
import { isEntityPresent } from '@atlaskit/link-extractors/is-entity-present';
import type { CardProviderRenderers } from '@atlaskit/link-provider/types';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getEmptyJsonLd } from '../../utils/get-empty-json-ld';
import { type InlineCardResolvedViewProps } from '../../view/InlineCard/ResolvedView';
import { extractIcon } from '../common/icon/extractIcon';
import { extractLozenge } from '../common/lozenge/extractLozenge';
import { extractTaskType } from '../common/lozenge/extractTaskType';
import { extractTitleTextColor } from '../common/primitives/extractTitleTextColor';
import { extractTitlePrefix } from '../common/title-prefix/extractTitlePrefix';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';

const extractInlineIcon = (jsonLd: JsonLd.Data.BaseData, showIconLabel = true) => {
	const provider = extractProvider(jsonLd);
	if (provider && provider.id) {
		if (provider.id === CONFLUENCE_GENERATOR_ID || provider.id === JIRA_GENERATOR_ID) {
			if (fg('platform_navx_jira_issue_type_icon_label_a11y')) {
				const icon = extractIcon(jsonLd, 'type', showIconLabel);
				if (provider.id === JIRA_GENERATOR_ID && typeof icon === 'string') {
					const taskTypeLabel = extractTaskType(jsonLd as JsonLd.Data.Task)?.name?.trim();
					if (taskTypeLabel) {
						return [icon, taskTypeLabel];
					}
				}
				return icon;
			}
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
		const entityIcon = extractEntityIcon(response);
		if (entityIcon) {
			return [entityIcon.url, entityIcon.label];
		}
		const provider = extractEntityProvider(response);
		if (provider) {
			return provider.icon;
		}
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
		icon: isExperimentEnabled('confluence_1p_and_3p_connection_byline_experiment')
			? extractSmartLinkInlineIconFromLinkExtractors(response, showLabel)
			: extractSmartLinkInlineIcon(response, showLabel),
		// As we migrate to support more entities we can incorporate these fields
		lozenge: extractLozenge(jsonLd),
		titleTextColor: extractTitleTextColor(jsonLd),
		titlePrefix: extractTitlePrefix(jsonLd, renderers, 'inline'),
		type: extractType(jsonLd),
	};
};
