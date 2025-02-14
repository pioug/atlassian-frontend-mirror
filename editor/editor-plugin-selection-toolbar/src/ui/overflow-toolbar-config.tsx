import React from 'react';

import type { Command, FloatingToolbarItem } from '@atlaskit/editor-common/types';

import { ContextualToolbarIcon } from './icons/ContextualToolbarIcon';
import { FixedToolbarIcon } from './icons/FixedToolbarIcon';

// New editor controls
export const overflowToolbarConfig = [
	{ type: 'separator' },
	{
		type: 'overflow-dropdown',
		options: [
			{
				type: 'separator',
			},
			{
				type: 'overflow-dropdown-heading',
				title: 'Toolbar position',
			},
			{
				title: 'Contextual',
				onClick: () => {
					return true;
				},
				icon: <ContextualToolbarIcon label="Contextual toolbar" />,
			},
			{
				title: 'Fixed at top',
				onClick: () => {
					return true;
				},
				icon: <FixedToolbarIcon label="Fixed toolbar" />,
			},
		],
	},
] as Array<FloatingToolbarItem<Command>>;
