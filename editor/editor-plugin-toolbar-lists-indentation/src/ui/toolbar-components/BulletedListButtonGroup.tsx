import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import {
	BULLETED_LIST_BUTTON,
	BULLETED_LIST_BUTTON_GROUP,
	TEXT_SECTION_PRIMARY_TOOLBAR,
} from '@atlaskit/editor-common/toolbar/keys';
import { TEXT_SECTION_PRIMARY_TOOLBAR_RANK } from '@atlaskit/editor-common/toolbar/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';
import { Show } from '@atlaskit/editor-toolbar/show';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { BulletedListButton } from './BulletedListButton';

const BulletedListButtonGroup = ({ children }: { children: React.ReactNode }) => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return (
			<Show above="xl">
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	}
};

export const getBulletedListButtonGroup = (
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: BULLETED_LIST_BUTTON_GROUP.type,
			key: BULLETED_LIST_BUTTON_GROUP.key,
			parents: [
				{
					type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
					key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
					rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[BULLETED_LIST_BUTTON_GROUP.key],
				},
			],
			component: ({ children }) => {
				return <BulletedListButtonGroup>{children}</BulletedListButtonGroup>;
			},
		},
		{
			type: BULLETED_LIST_BUTTON.type,
			key: BULLETED_LIST_BUTTON.key,
			parents: [
				{
					type: BULLETED_LIST_BUTTON_GROUP.type,
					key: BULLETED_LIST_BUTTON_GROUP.key,
					rank: 100,
				},
			],
			component: ({ parents }) => <BulletedListButton api={api} parents={parents} />,
		},
	];
};
