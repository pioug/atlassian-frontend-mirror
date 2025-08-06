import React from 'react';

import {
	CLEAR_FORMARTTING_MENU_SECTION,
	CLEAR_FORMATTING_MENU_ITEM,
	TEXT_FORMATTING_GROUP,
	TEXT_FORMATTING_HERO_BUTTON,
	TEXT_FORMATTING_MENU,
	TEXT_FORMATTING_MENU_SECTION,
	TEXT_SECTION,
	TEXT_SECTION_RANK,
	TEXT_FORMAT_GROUP_RANK,
	TEXT_FORMAT_MENU_RANK,
	CLEAR_FORMARTTING_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownDivider } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { type TextFormattingPlugin } from '../textFormattingPluginType';

import {
	FormatMenuItem,
	FormatButton,
	ClearFormatMenuItem,
	MoreFormattingMenu,
} from './Toolbar/components/Component';
import { formatOptions } from './Toolbar/components/utils';
import { FormatOptions } from './Toolbar/types';

const getFormatMenuItems = (
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
							api={api}
							parents={parents}
							icon={icon}
							shortcut={shortcut}
							title={title}
							optionType={optionType}
							toggleMarkWithAnalyticsCallback={command}
						/>
					);
				},
			};
		},
	);
};

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => [
	{
		type: TEXT_FORMATTING_GROUP.type,
		key: TEXT_FORMATTING_GROUP.key,
		parents: [
			{
				type: TEXT_SECTION.type,
				key: TEXT_SECTION.key,
				rank: TEXT_SECTION_RANK[TEXT_FORMATTING_GROUP.key],
			},
		],
	},
	{
		type: TEXT_FORMATTING_HERO_BUTTON.type,
		key: TEXT_FORMATTING_HERO_BUTTON.key,
		parents: [
			{
				type: TEXT_FORMATTING_GROUP.type,
				key: TEXT_FORMATTING_GROUP.key,
				rank: TEXT_FORMAT_GROUP_RANK[TEXT_FORMATTING_HERO_BUTTON.key],
			},
		],
		component: ({ parents }) => {
			const { icon, command, shortcut, title } = formatOptions().strong;
			return (
				<FormatButton
					api={api}
					parents={parents}
					icon={icon}
					title={title}
					shortcut={shortcut}
					optionType={FormatOptions.strong}
					toggleMarkWithAnalyticsCallback={command}
				/>
			);
		},
	},
	{
		type: TEXT_FORMATTING_MENU.type,
		key: TEXT_FORMATTING_MENU.key,
		parents: [
			{
				type: TEXT_FORMATTING_GROUP.type,
				key: TEXT_FORMATTING_GROUP.key,
				rank: TEXT_FORMAT_GROUP_RANK[TEXT_FORMATTING_MENU.key],
			},
		],
		component: ({ children, groupLocation }) => {
			return <MoreFormattingMenu groupLocation={groupLocation}>{children}</MoreFormattingMenu>;
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
		],
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
		],
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
					<ToolbarDropdownDivider />
					<ClearFormatMenuItem parents={parents} api={api} />
				</>
			);
		},
	},
];
