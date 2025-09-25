import React from 'react';

import {
	BOLD_BUTTON_GROUP,
	BOLD_BUTTON,
	TEXT_SECTION_PRIMARY_TOOLBAR,
	TEXT_FORMAT_GROUP_RANK,
	useEditorToolbar,
} from '@atlaskit/editor-common/toolbar';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Show, ToolbarButtonGroup } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { type TextFormattingPlugin } from '../../../textFormattingPluginType';
import { FormatOptions } from '../types';

import { FormatButton } from './Component';
import { formatOptions } from './utils';

const BoldButtonGroup = ({ children }: { children: React.ReactNode }) => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return (
			<Show above="xl">
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	}
};

export const boldButtonGroup = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => [
	{
		type: BOLD_BUTTON_GROUP.type,
		key: BOLD_BUTTON_GROUP.key,
		parents: [
			{
				type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
				key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
				rank: TEXT_FORMAT_GROUP_RANK[BOLD_BUTTON_GROUP.key],
			},
		],
		component: ({ children }) => {
			return <BoldButtonGroup>{children}</BoldButtonGroup>;
		},
	},
	{
		type: BOLD_BUTTON.type,
		key: BOLD_BUTTON.key,
		parents: [
			{
				type: BOLD_BUTTON_GROUP.type,
				key: BOLD_BUTTON_GROUP.key,
				rank: 100,
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
