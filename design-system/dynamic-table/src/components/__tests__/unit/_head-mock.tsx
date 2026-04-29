import React from 'react';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';

import type { HeadType } from '../../../types';

export const headMock1: HeadType = {
	cells: [
		{
			key: 'first_name',
			content: 'First name',
			isSortable: true,
		},
		{
			key: 'last_name',
			content: 'Last name',
		},
		{
			key: 'party',
			content: 'Party',
			isSortable: true,
		},
		{
			key: 'star',
			content: <StarStarredIcon label="starred" />,
			isSortable: true,
			isIconOnlyHeader: true,
		},
	],
};
