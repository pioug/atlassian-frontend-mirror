import { JsonLd } from 'json-ld-types';
import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';

import {
  extractLink,
  extractTitle,
  extractTitleTextColor,
} from '../common/primitives';
import { extractLozenge } from '../common/lozenge';
import { extractIcon } from '../common/icon';
import { extractTitlePrefix } from '../common/title-prefix';
import { extractProvider } from '../common/context';
import { CardProviderRenderers } from '../../state/context/types';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';

export const extractInlineIcon = (jsonLd: JsonLd.Data.BaseData) => {
  const provider = extractProvider(jsonLd);
  if (provider && provider.id) {
    if (
      provider.id === CONFLUENCE_GENERATOR_ID ||
      provider.id === JIRA_GENERATOR_ID
    ) {
      return extractIcon(jsonLd);
    }
  }
  return extractIcon(jsonLd, 'provider');
};

export const extractInlineProps = (
  jsonLd: JsonLd.Data.BaseData,
  renderers?: CardProviderRenderers,
): InlineCardResolvedViewProps => ({
  link: extractLink(jsonLd),
  title: extractTitle(jsonLd),
  lozenge: extractLozenge(jsonLd),
  icon: extractInlineIcon(jsonLd),
  titleTextColor: extractTitleTextColor(jsonLd),
  titlePrefix: extractTitlePrefix(jsonLd, renderers, 'inline'),
});
