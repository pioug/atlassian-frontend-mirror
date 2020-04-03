import React from 'react';
import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';

import ConfluenceBlogIcon from '@atlaskit/icon-object/glyph/blog/16';
import { CONFLUENCE_GENERATOR_ID } from '../utils/constants';

import { BuildInlineProps } from './types';
import { extractInlineViewPropsFromTextDocument } from './extractPropsFromTextDocument';

export const buildBlogPostIcon: BuildInlineProps<InlineCardResolvedViewProps> = json => {
  if (json.generator && json.generator['@id'] === CONFLUENCE_GENERATOR_ID) {
    return { icon: <ConfluenceBlogIcon label="Confluence" /> };
  }
  return {};
};

export function extractInlineViewPropsFromBlogPost(
  json: any,
): InlineCardResolvedViewProps {
  const props = extractInlineViewPropsFromTextDocument(json);
  return {
    ...props,
    ...buildBlogPostIcon(json),
  };
}
