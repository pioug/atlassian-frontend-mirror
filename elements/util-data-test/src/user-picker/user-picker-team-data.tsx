import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { Team } from '@atlaskit/user-picker';
import ChevronRight from './ChevronRight';

export const userPickerTeamData: Team[] = [
  {
    id: 'team-custom-icon',
    name: 'Team with custom icon',
    type: 'team',
    fixed: false,
    description: 'This team has a custom icon',
    lozenge: <ChevronRight />,
  },
  {
    id: 'team-custom-icon-and-byline',
    name: 'Team with custom icon and byline',
    type: 'team',
    fixed: false,
    description:
      'This team has a custom icon and byline which is not reliant on memberCount and includesYou props',
    byline: 'Select team members',
    lozenge: <ChevronRight />,
  },
];
