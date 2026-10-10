import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import {
	LISTS_INDENTATION_GROUP,
	LISTS_INDENTATION_GROUP_COLLAPSED,
	TEXT_SECTION_PRIMARY_TOOLBAR,
} from '@atlaskit/editor-common/toolbar/keys';
import { TEXT_SECTION_PRIMARY_TOOLBAR_RANK } from '@atlaskit/editor-common/toolbar/rank';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';
import { Show } from '@atlaskit/editor-toolbar/show';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';

const ListsIndentationGroup = ({ children }: { children: React.ReactNode }) => {
	const { editorAppearance } = useEditorToolbar();
	if (editorAppearance === 'full-page') {
		return (
			<Show above="xl">
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	}
};

const ListsIndentationGroupCollapsed = ({ children }: { children: React.ReactNode }) => {
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

export const getListsIndentationGroupForPrimaryToolbar = (): RegisterComponent[] => {
	return [
		{
			type: LISTS_INDENTATION_GROUP.type,
			key: LISTS_INDENTATION_GROUP.key,
			parents: [
				{
					type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
					key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
					rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[LISTS_INDENTATION_GROUP.key],
				},
			],
			component: ({ children }) => {
				return <ListsIndentationGroup>{children}</ListsIndentationGroup>;
			},
		},
		{
			type: LISTS_INDENTATION_GROUP_COLLAPSED.type,
			key: LISTS_INDENTATION_GROUP_COLLAPSED.key,
			parents: [
				{
					type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
					key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
					rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[LISTS_INDENTATION_GROUP.key],
				},
			],
			component: ({ children }) => {
				return <ListsIndentationGroupCollapsed>{children}</ListsIndentationGroupCollapsed>;
			},
		},
	];
};
