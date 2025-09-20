import {
	FORMAT_BULLETED_LIST_MENU_ITEM,
	FORMAT_NESTED_MENU_RANK,
	FORMAT_NESTED_MENU_RANK_REVISED,
	FORMAT_NUMBERED_LIST_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ListPlugin } from '../listPluginType';

import { createBulletedListBlockMenuItem } from './BulletedListBlockMenuItem';
import { createNumberedListBlockMenuItem } from './NumberedListBlockMenuItem';

export const getListComponents = (
	api: ExtractInjectionAPI<ListPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item',
			key: FORMAT_BULLETED_LIST_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: fg('platform_editor_block_menu_format_rank_revised')
					? FORMAT_NESTED_MENU_RANK_REVISED[FORMAT_BULLETED_LIST_MENU_ITEM.key]
					: FORMAT_NESTED_MENU_RANK[FORMAT_BULLETED_LIST_MENU_ITEM.key],
			},
			component: createBulletedListBlockMenuItem({ api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_NUMBERED_LIST_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: fg('platform_editor_block_menu_format_rank_revised')
					? FORMAT_NESTED_MENU_RANK_REVISED[FORMAT_NUMBERED_LIST_MENU_ITEM.key]
					: FORMAT_NESTED_MENU_RANK[FORMAT_NUMBERED_LIST_MENU_ITEM.key],
			},
			component: createNumberedListBlockMenuItem({ api }),
		},
	];
};
