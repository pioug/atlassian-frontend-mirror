import React from 'react';

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
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';

import { HeadingMenuItem } from './HeadingMenuItem';
import { ParagraphMenuItem } from './ParagraphMenuItem';
import { QuoteMenuItem } from './QuoteMenuItem';

export const getBlockTypeComponents = (): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_1_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_1_MENU_ITEM.key],
			},
			component: () => <HeadingMenuItem level={1} />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_2_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_2_MENU_ITEM.key],
			},
			component: () => <HeadingMenuItem level={2} />,
		},

		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_3_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_3_MENU_ITEM.key],
			},
			component: () => <HeadingMenuItem level={3} />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_4_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_4_MENU_ITEM.key],
			},
			component: () => <HeadingMenuItem level={4} />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_5_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_5_MENU_ITEM.key],
			},
			component: () => <HeadingMenuItem level={5} />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_HEADING_6_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_HEADING_6_MENU_ITEM.key],
			},
			component: () => <HeadingMenuItem level={6} />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_PARAGRAPH_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_PARAGRAPH_MENU_ITEM.key],
			},
			component: () => <ParagraphMenuItem />,
		},
		{
			type: 'block-menu-item',
			key: FORMAT_QUOTE_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: 'nested-menu-format-section-primary',
				rank: FORMAT_NESTED_MENU_RANK[FORMAT_QUOTE_MENU_ITEM.key],
			},
			component: () => <QuoteMenuItem />,
		},
	];
};
