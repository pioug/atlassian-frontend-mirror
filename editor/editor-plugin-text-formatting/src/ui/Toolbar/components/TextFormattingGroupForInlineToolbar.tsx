import React from 'react';

import {
	TEXT_FORMATTING_GROUP_INLINE,
	TEXT_FORMATTING_HERO_BUTTON,
	TEXT_SECTION,
	TEXT_SECTION_RANK,
	TEXT_FORMATTING_GROUP,
	TEXT_FORMAT_GROUP_RANK,
} from '@atlaskit/editor-common/toolbar';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { type TextFormattingPlugin } from '../../../textFormattingPluginType';
import { FormatOptions } from '../types';

import { FormatButton } from './Component';
import { formatOptions } from './utils';

export const textFormattingGroupForInlineToolbar = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => [
	{
		type: TEXT_FORMATTING_GROUP_INLINE.type,
		key: TEXT_FORMATTING_GROUP_INLINE.key,
		parents: [
			{
				type: TEXT_SECTION.type,
				key: TEXT_SECTION.key,
				rank: TEXT_SECTION_RANK[TEXT_FORMATTING_GROUP.key],
			},
		],
		component: ({ children }) => {
			return <ToolbarButtonGroup>{children}</ToolbarButtonGroup>;
		},
	},
	{
		type: TEXT_FORMATTING_HERO_BUTTON.type,
		key: TEXT_FORMATTING_HERO_BUTTON.key,
		parents: [
			{
				type: TEXT_FORMATTING_GROUP_INLINE.type,
				key: TEXT_FORMATTING_GROUP_INLINE.key,
				rank: TEXT_FORMAT_GROUP_RANK[TEXT_FORMATTING_HERO_BUTTON.key],
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
