import React from 'react';
import { N600 } from '@atlaskit/theme/colors';
import PeopleIcon from '@atlaskit/icon/glyph/people';

import { JsonLd } from 'json-ld-types';
import { LinkDetail } from './types';

export type LinkSubscriberType =
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task
  | JsonLd.Data.TaskType;

export const extractSubscriberCount = (
  jsonLd: LinkSubscriberType,
): LinkDetail | undefined => {
  const subscriberCount = jsonLd['atlassian:subscriberCount'];
  if (subscriberCount) {
    return {
      text: subscriberCount.toString(),
      icon: <PeopleIcon size="small" label="subscribers" primaryColor={N600} />,
    };
  }
};
