import React from 'react';
import { Team } from '@atlaskit/user-picker';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

export const userPickerTeamData: Team[] = [
  {
    id: 'team-custom-icon',
    name: 'Team with custom icon',
    type: 'team',
    fixed: false,
    description: 'This team has a custom icon',
    lozenge: <ChevronRightIcon label="chevron right" size="large" />,
  },
  {
    id: 'team-custom-icon-and-byline',
    name: 'Team with custom icon and byline',
    type: 'team',
    fixed: false,
    description:
      'This team has a custom icon and byline which is not reliant on memberCount and includesYou props',
    byline: 'Select team members',
    lozenge: <ChevronRightIcon label="chevron right" size="large" />,
  },
];
