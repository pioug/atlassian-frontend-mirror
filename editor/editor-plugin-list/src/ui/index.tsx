import {
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_BULLETED_LIST_MENU_ITEM,
	TRANSFORM_STRUCTURE_NUMBERED_LIST_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';

import type { ListPlugin } from '../listPluginType';

import { createBulletedListBlockMenuItem } from './BulletedListBlockMenuItem';
import { createNumberedListBlockMenuItem } from './NumberedListBlockMenuItem';

export const getListComponents = (
	api: ExtractInjectionAPI<ListPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_BULLETED_LIST_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[
					TRANSFORM_STRUCTURE_BULLETED_LIST_MENU_ITEM.key
				],
			},
			component: createBulletedListBlockMenuItem({ api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_NUMBERED_LIST_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[
					TRANSFORM_STRUCTURE_NUMBERED_LIST_MENU_ITEM.key
				],
			},
			component: createNumberedListBlockMenuItem({ api }),
		},
	];
};
