import React from 'react';

import {
	FORMAT_BULLETED_LIST_MENU_ITEM,
	FORMAT_NESTED_MENU_RANK,
	FORMAT_NUMBERED_LIST_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';

import { BulletedListMenuItem } from './BulletedListMenuItem';
import { NumberedListMenuItem } from './NumberedListMenuItem';

export const getListComponents = (): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item',
			key: FORMAT_BULLETED_LIST_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_BULLETED_LIST_MENU_ITEM.key],
			},
			component: () => <BulletedListMenuItem />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_NUMBERED_LIST_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_NUMBERED_LIST_MENU_ITEM.key],
			},
			component: () => <NumberedListMenuItem />,
		},
	];
};
