import React from 'react';
import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';
import ProjectDefaultIcon from '@atlaskit/icon/glyph/people-group';

import { BuildInlineProps } from './types';
import { extractInlineViewPropsFromDocument } from './extractPropsFromDocument';

export const buildProjectIcon: BuildInlineProps<InlineCardResolvedViewProps> = json => {
  if (json.icon && json.icon.url) {
    return { icon: json.icon.url };
  }
  return {
    icon: <ProjectDefaultIcon size="small" label={json.name || 'Project'} />,
  };
};

export function extractInlineViewPropsFromProject(
  json: any,
): InlineCardResolvedViewProps {
  const props = extractInlineViewPropsFromDocument(json);
  return {
    ...props,
    ...buildProjectIcon(json),
  };
}
