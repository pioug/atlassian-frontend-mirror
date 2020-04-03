import React from 'react';
import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import ConfluencePageIcon from '@atlaskit/icon-object/glyph/page/16';

import { BuildInlineProps } from './types';
import { extractInlineViewPropsFromDocument } from './extractPropsFromDocument';
import { CONFLUENCE_GENERATOR_ID } from '../utils/constants';

export const buildTextDocumentIcon: BuildInlineProps<InlineCardResolvedViewProps> = json => {
  if (json.generator && json.generator['@id'] === CONFLUENCE_GENERATOR_ID) {
    return { icon: <ConfluencePageIcon label="Confluence" /> };
  }
  return {};
};

export function extractInlineViewPropsFromTextDocument(
  json: any,
): InlineCardResolvedViewProps {
  const props = extractInlineViewPropsFromDocument(json);
  return {
    ...props,
    ...buildTextDocumentIcon(json),
  };
}
