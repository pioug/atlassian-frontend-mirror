import { type JsonLd } from 'json-ld-types';
import { type CardProviderRenderers } from '@atlaskit/link-provider';
import { extractTitleTextColor } from '../common/primitives';
import { extractLozenge } from '../common/lozenge';
import { extractIcon } from '../common/icon';
import { extractTitlePrefix } from '../common/title-prefix';
import { extractLink, extractTitle, extractProvider } from '@atlaskit/link-extractors';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';
import { type InlineCardResolvedViewProps } from '../../view/InlineCard/ResolvedView';

export const extractInlineIcon = (jsonLd: JsonLd.Data.BaseData) => {
	const provider = extractProvider(jsonLd);
	if (provider && provider.id) {
		if (provider.id === CONFLUENCE_GENERATOR_ID || provider.id === JIRA_GENERATOR_ID) {
			return extractIcon(jsonLd);
		}
	}
	return extractIcon(jsonLd, 'provider');
};

export const extractInlineProps = (
	jsonLd: JsonLd.Data.BaseData,
	renderers?: CardProviderRenderers,
	removeTextHighlightingFromTitle?: boolean,
): InlineCardResolvedViewProps => ({
	link: extractLink(jsonLd),
	title: extractTitle(jsonLd, removeTextHighlightingFromTitle),
	lozenge: extractLozenge(jsonLd),
	icon: extractInlineIcon(jsonLd),
	titleTextColor: extractTitleTextColor(jsonLd),
	titlePrefix: extractTitlePrefix(jsonLd, renderers, 'inline'),
});
