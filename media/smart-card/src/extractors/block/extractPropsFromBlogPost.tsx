import React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import ConfluenceBlogIcon from '@atlaskit/icon-object/glyph/blog/16';

import { CONFLUENCE_GENERATOR_ID } from '../utils/constants';
import { extractPropsFromTextDocument } from './extractPropsFromTextDocument';

export const buildBlogPostIcon = (json: any) => {
  if (json.generator && json.generator['@id'] === CONFLUENCE_GENERATOR_ID) {
    return { icon: { icon: <ConfluenceBlogIcon label="Confluence" /> } };
  }
  return {};
};

export function extractPropsFromBlogPost(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromTextDocument(json);
  return {
    ...props,
    ...buildBlogPostIcon(json),
  };
}
