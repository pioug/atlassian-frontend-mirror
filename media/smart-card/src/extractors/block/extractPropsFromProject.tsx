import React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import TeamIcon from '@atlaskit/icon/glyph/people-group';
import ProjectDefaultIcon from '@atlaskit/icon/glyph/people-group';

import { extractPropsFromObject } from './extractPropsFromObject';

export function extractPropsFromProject(json: any): BlockCardResolvedViewProps {
  const props = extractPropsFromObject(json);
  props.byline = 'Project';

  if (
    json.member &&
    json.member['@type'] === 'Collection' &&
    json.member.totalItems > 0
  ) {
    props.details = props.details || [];
    props.details.push({
      text: `${json.member.totalItems} Members`,
      icon: <TeamIcon size="small" label="members" />,
    });
  }

  props.icon = {
    icon: <ProjectDefaultIcon size="small" label={json.name || 'Project'} />,
  };

  return props;
}
