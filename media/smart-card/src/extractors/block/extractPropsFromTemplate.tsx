import React from 'react';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { CONFLUENCE_GENERATOR_ID } from '../utils/constants';
import { extractPropsFromDocument } from './extractPropsFromDocument';

export const buildTemplateIcon = (json: any) => {
  if (json.generator && json.generator['@id'] === CONFLUENCE_GENERATOR_ID) {
    return { icon: <DocumentFilledIcon size="small" label="Confluence" /> };
  }
  return {};
};

export function extractPropsFromTemplate(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromDocument(json);
  return {
    ...buildTemplateIcon(json),
    ...props,
  };
}
