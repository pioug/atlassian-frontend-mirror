import {
	FORMAT_HEADING_1_MENU_ITEM,
	FORMAT_HEADING_2_MENU_ITEM,
	FORMAT_HEADING_3_MENU_ITEM,
	FORMAT_HEADING_4_MENU_ITEM,
	FORMAT_HEADING_5_MENU_ITEM,
	FORMAT_HEADING_6_MENU_ITEM,
	FORMAT_NESTED_MENU_RANK,
	FORMAT_PARAGRAPH_MENU_ITEM,
	FORMAT_QUOTE_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';

import type { BlockTypePlugin } from '../blockTypePluginType';

import { createHeadingBlockMenuItem } from './HeadingBlockMenuItem';
import { createParagraphBlockMenuItem } from './ParagraphBlockMenuItem';
import { createQuoteBlockMenuItem } from './QuoteBlockMenuItem';

export const getBlockTypeComponents = (
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_1_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_1_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 1, api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_2_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_2_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 2, api }),
		},

		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_3_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_3_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 3, api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_4_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_4_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 4, api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_5_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_5_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 5, api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_6_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_6_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 6, api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_PARAGRAPH_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_PARAGRAPH_MENU_ITEM.key],
			},
			component: createParagraphBlockMenuItem({ api }),
		},
		{
			type: 'block-menu-item',
			key: FORMAT_QUOTE_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_QUOTE_MENU_ITEM.key],
			},
			component: createQuoteBlockMenuItem({ api }),
		},
	];
};
