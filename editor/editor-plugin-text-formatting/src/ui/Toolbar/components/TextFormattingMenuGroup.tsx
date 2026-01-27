import React from 'react';

import {
	CLEAR_FORMARTTING_MENU_SECTION,
	CLEAR_FORMATTING_MENU_ITEM,
	TEXT_FORMATTING_MENU,
	TEXT_FORMATTING_MENU_SECTION,
	TEXT_FORMATTING_GROUP,
	TEXT_FORMATTING_GROUP_COLLAPSED,
	TEXT_FORMATTING_GROUP_INLINE,
	TEXT_FORMATTING_HERO_BUTTON,
	TEXT_FORMAT_GROUP_RANK,
	TEXT_FORMAT_MENU_RANK,
	CLEAR_FORMARTTING_MENU_SECTION_RANK,
	TEXT_COLLAPSED_MENU_RANK,
	TEXT_COLLAPSED_MENU,
} from '@atlaskit/editor-common/toolbar';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { type TextFormattingPlugin } from '../../../textFormattingPluginType';
import type { FormatOptions } from '../types';

import { ClearFormatMenuItem, MoreFormattingMenu, MenuSection, FormatMenuItem } from './Component';
import { formatOptions } from './utils';

export const getFormatMenuItems = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => {
	return Object.entries(formatOptions()).map(
		([optionType, { icon, shortcut, title, command, rank, key }]) => {
			return {
				type: 'menu-item',
				key,
				parents: [
					{ type: TEXT_FORMATTING_MENU_SECTION.type, key: TEXT_FORMATTING_MENU_SECTION.key, rank },
				],
				component: ({ parents }) => {
					return (
						<FormatMenuItem
							api={api as ExtractInjectionAPI<TextFormattingPlugin>}
							parents={parents}
							icon={icon}
							shortcut={shortcut}
							title={title}
							optionType={optionType as FormatOptions}
							toggleMarkWithAnalyticsCallback={command}
						/>
					);
				},
			};
		},
	);
};

export const textFormattingMenuGroup = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => [
	{
		type: TEXT_FORMATTING_MENU.type,
		key: TEXT_FORMATTING_MENU.key,
		parents: [
			{
				type: TEXT_FORMATTING_GROUP.type,
				key: TEXT_FORMATTING_GROUP.key,
				rank: TEXT_FORMAT_GROUP_RANK[TEXT_FORMATTING_MENU.key],
			},
			{
				type: TEXT_FORMATTING_GROUP_COLLAPSED.type,
				key: TEXT_FORMATTING_GROUP_COLLAPSED.key,
				rank: TEXT_FORMAT_GROUP_RANK[TEXT_FORMATTING_MENU.key],
			},
			{
				type: TEXT_FORMATTING_GROUP_INLINE.type,
				key: TEXT_FORMATTING_GROUP_INLINE.key,
				rank: TEXT_FORMAT_GROUP_RANK[TEXT_FORMATTING_HERO_BUTTON.key],
			},
		],
		component: ({ children }) => {
			return <MoreFormattingMenu>{children}</MoreFormattingMenu>;
		},
	},
	{
		type: TEXT_FORMATTING_MENU_SECTION.type,
		key: TEXT_FORMATTING_MENU_SECTION.key,
		parents: [
			{
				type: TEXT_FORMATTING_MENU.type,
				key: TEXT_FORMATTING_MENU.key,
				rank: TEXT_FORMAT_MENU_RANK[TEXT_FORMATTING_MENU_SECTION.key],
			},
			{
				type: TEXT_COLLAPSED_MENU.type,
				key: TEXT_COLLAPSED_MENU.key,
				rank: TEXT_COLLAPSED_MENU_RANK[TEXT_FORMATTING_MENU_SECTION.key],
			},
		],
		component: MenuSection,
	},
	...getFormatMenuItems(api),
	{
		type: CLEAR_FORMARTTING_MENU_SECTION.type,
		key: CLEAR_FORMARTTING_MENU_SECTION.key,
		parents: [
			{
				type: TEXT_FORMATTING_MENU.type,
				key: TEXT_FORMATTING_MENU.key,
				rank: TEXT_FORMAT_MENU_RANK[CLEAR_FORMARTTING_MENU_SECTION.key],
			},
			{
				type: TEXT_COLLAPSED_MENU.type,
				key: TEXT_COLLAPSED_MENU.key,
				rank: TEXT_COLLAPSED_MENU_RANK[CLEAR_FORMARTTING_MENU_SECTION.key],
			},
		],
		component: ({ children }) => {
			return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
		},
	},
	{
		type: CLEAR_FORMATTING_MENU_ITEM.type,
		key: CLEAR_FORMATTING_MENU_ITEM.key,
		parents: [
			{
				type: CLEAR_FORMARTTING_MENU_SECTION.type,
				key: CLEAR_FORMARTTING_MENU_SECTION.key,
				rank: CLEAR_FORMARTTING_MENU_SECTION_RANK[CLEAR_FORMATTING_MENU_ITEM.key],
			},
		],
		component: ({ parents }) => {
			return (
				<>
					<ClearFormatMenuItem
						parents={parents}
						api={api as ExtractInjectionAPI<TextFormattingPlugin>}
					/>
				</>
			);
		},
	},
];
