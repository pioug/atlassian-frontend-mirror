import {
	TRANSFORM_HEADINGS_MENU_SECTION,
	TRANSFORM_HEADINGS_MENU_SECTION_RANK,
	TRANSFORM_HEADINGS_H1_MENU_ITEM,
	TRANSFORM_HEADINGS_H2_MENU_ITEM,
	TRANSFORM_HEADINGS_H3_MENU_ITEM,
	TRANSFORM_HEADINGS_H4_MENU_ITEM,
	TRANSFORM_HEADINGS_H5_MENU_ITEM,
	TRANSFORM_HEADINGS_H6_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
	TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM,
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
			key: TRANSFORM_HEADINGS_H1_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_HEADINGS_MENU_SECTION.key,
				rank: TRANSFORM_HEADINGS_MENU_SECTION_RANK[TRANSFORM_HEADINGS_H1_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 1, api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H2_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_HEADINGS_MENU_SECTION.key,
				rank: TRANSFORM_HEADINGS_MENU_SECTION_RANK[TRANSFORM_HEADINGS_H2_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 2, api }),
		},

		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H3_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_HEADINGS_MENU_SECTION.key,
				rank: TRANSFORM_HEADINGS_MENU_SECTION_RANK[TRANSFORM_HEADINGS_H3_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 3, api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H4_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_HEADINGS_MENU_SECTION.key,
				rank: TRANSFORM_HEADINGS_MENU_SECTION_RANK[TRANSFORM_HEADINGS_H4_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 4, api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H5_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_HEADINGS_MENU_SECTION.key,
				rank: TRANSFORM_HEADINGS_MENU_SECTION_RANK[TRANSFORM_HEADINGS_H5_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 5, api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H6_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_HEADINGS_MENU_SECTION.key,
				rank: TRANSFORM_HEADINGS_MENU_SECTION_RANK[TRANSFORM_HEADINGS_H6_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 6, api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key],
			},
			component: createQuoteBlockMenuItem({ api }),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key],
			},
			component: createParagraphBlockMenuItem({ api }),
		},
	];
};
