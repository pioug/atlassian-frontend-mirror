import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import {
	UNDERLINE_BUTTON_GROUP,
	UNDERLINE_BUTTON,
	TEXT_SECTION_PRIMARY_TOOLBAR,
} from '@atlaskit/editor-common/toolbar/keys';
import { TEXT_SECTION_PRIMARY_TOOLBAR_RANK } from '@atlaskit/editor-common/toolbar/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';
import { Show } from '@atlaskit/editor-toolbar/show';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';

import type { TextFormattingPlugin } from '../../../textFormattingPluginType';
import { FormatOptions } from '../types';
import { FormatButton } from './Component';
import { formatOptions } from './utils';

const UnderlineButtonGroup = ({ children }: { children: React.ReactNode }) => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return (
			<Show above="xl">
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	}
};

export const underlineButtonGroup = (
	api?: ExtractInjectionAPI<TextFormattingPlugin>,
): RegisterComponent[] => [
	{
		type: UNDERLINE_BUTTON_GROUP.type,
		key: UNDERLINE_BUTTON_GROUP.key,
		parents: [
			{
				type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
				key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
				rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[UNDERLINE_BUTTON_GROUP.key],
			},
		],
		component: ({ children }) => {
			return <UnderlineButtonGroup>{children}</UnderlineButtonGroup>;
		},
	},
	{
		type: UNDERLINE_BUTTON.type,
		key: UNDERLINE_BUTTON.key,
		parents: [
			{
				type: UNDERLINE_BUTTON_GROUP.type,
				key: UNDERLINE_BUTTON_GROUP.key,
				rank: 100,
			},
		],
		component: ({ parents }) => {
			const { icon, command, shortcut, title } = formatOptions().underline;
			return (
				<FormatButton
					api={api as ExtractInjectionAPI<TextFormattingPlugin>}
					parents={parents}
					icon={icon}
					title={title}
					shortcut={shortcut}
					optionType={FormatOptions.underline}
					toggleMarkWithAnalyticsCallback={command}
				/>
			);
		},
	},
];
