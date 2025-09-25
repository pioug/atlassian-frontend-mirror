import React from 'react';

import {
	TEXT_FORMATTING_GROUP,
	TEXT_FORMATTING_HERO_BUTTON,
	TEXT_FORMATTING_GROUP_COLLAPSED,
	TEXT_FORMATTING_HERO_BUTTON_COLLAPSED,
	TEXT_SECTION_PRIMARY_TOOLBAR,
	TEXT_FORMAT_GROUP_RANK,
	TEXT_FORMAT_GROUP_COLLAPSED_RANK,
	TEXT_SECTION_PRIMARY_TOOLBAR_RANK,
	useEditorToolbar,
} from '@atlaskit/editor-common/toolbar';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Show, ToolbarButtonGroup } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { type TextFormattingPlugin } from '../../../textFormattingPluginType';
import { FormatOptions } from '../types';

import { FormatButton } from './Component';
import { formatOptions } from './utils';

const TextFormattingGroup = ({ children }: { children: React.ReactNode }) => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return (
			<Show above="xl">
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	}
};

const TextFormattingGroupCollapsed = ({ children }: { children: React.ReactNode }) => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return (
			<Show below="xl">
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	}
	return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
};

export const textFormattingGroupForPrimaryToolbar = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => [
	{
		type: TEXT_FORMATTING_GROUP.type,
		key: TEXT_FORMATTING_GROUP.key,
		parents: [
			{
				type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
				key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
				rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[TEXT_FORMATTING_GROUP.key],
			},
		],
		component: ({ children }) => {
			return <TextFormattingGroup>{children}</TextFormattingGroup>;
		},
	},
	{
		type: TEXT_FORMATTING_GROUP_COLLAPSED.type,
		key: TEXT_FORMATTING_GROUP_COLLAPSED.key,
		parents: [
			{
				type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
				key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
				rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[TEXT_FORMATTING_GROUP.key],
			},
		],
		component: ({ children }) => {
			return <TextFormattingGroupCollapsed>{children}</TextFormattingGroupCollapsed>;
		},
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
			const { icon, command, shortcut, title } = formatOptions().em;
			return (
				<FormatButton
					api={api as ExtractInjectionAPI<TextFormattingPlugin>}
					parents={parents}
					icon={icon}
					title={title}
					shortcut={shortcut}
					optionType={FormatOptions.em}
					toggleMarkWithAnalyticsCallback={command}
				/>
			);
		},
	},
	{
		type: TEXT_FORMATTING_HERO_BUTTON_COLLAPSED.type,
		key: TEXT_FORMATTING_HERO_BUTTON_COLLAPSED.key,
		parents: [
			{
				type: TEXT_FORMATTING_GROUP_COLLAPSED.type,
				key: TEXT_FORMATTING_GROUP_COLLAPSED.key,
				rank: TEXT_FORMAT_GROUP_COLLAPSED_RANK[TEXT_FORMATTING_HERO_BUTTON_COLLAPSED.key],
			},
		],
		component: ({ parents }) => {
			const { icon, command, shortcut, title } = formatOptions().strong;
			return (
				<FormatButton
					api={api as ExtractInjectionAPI<TextFormattingPlugin>}
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
];
