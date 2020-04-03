import React from 'react';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import { BuildInlineProps } from './types';
import { CONFLUENCE_GENERATOR_ID } from '../utils/constants';
import { extractInlineViewPropsFromDocument } from './extractPropsFromDocument';

export const buildTemplateIcon: BuildInlineProps<InlineCardResolvedViewProps> = json => {
  if (json.generator && json.generator['@id'] === CONFLUENCE_GENERATOR_ID) {
    return { icon: <DocumentFilledIcon size="small" label="Confluence" /> };
  }
  return {};
};

export function extractInlineViewPropsFromTemplate(
  json: any,
): InlineCardResolvedViewProps {
  const props = extractInlineViewPropsFromDocument(json);
  return {
    ...buildTemplateIcon(json),
    ...props,
  };
}
