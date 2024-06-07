import React from 'react';
import { type Team } from '@atlaskit/user-picker';
import ChevronRight from './ChevronRight';

export const userPickerTeamData: Team[] = [
	{
		id: 'team-custom-icon',
		name: 'Team with custom icon',
		type: 'team',
		fixed: false,
		description: 'This team has a custom icon',
		lozenge: <ChevronRight />,
		tooltip: 'This team has a custom icon',
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
