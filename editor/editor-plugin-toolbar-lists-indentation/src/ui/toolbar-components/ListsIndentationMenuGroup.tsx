import React from 'react';

import {
	BULLETED_LIST_MENU_ITEM,
	INDENT_MENU_ITEM,
	LISTS_INDENTATION_GROUP,
	LISTS_INDENTATION_GROUP_COLLAPSED,
	LISTS_INDENTATION_GROUP_COLLAPSED_RANK,
	LISTS_INDENTATION_GROUP_INLINE,
	LISTS_INDENTATION_GROUP_RANK,
	LISTS_INDENTATION_MENU,
	LISTS_INDENTATION_MENU_RANK,
	LISTS_INDENTATION_MENU_SECTION,
	LISTS_INDENTATION_MENU_SECTION_RANK,
	NUMBERED_LIST_MENU_ITEM,
	OUTDENT_MENU_ITEM,
	TASK_LIST_MENU_ITEM,
	TEXT_COLLAPSED_MENU,
	TEXT_COLLAPSED_MENU_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

import { BulletedListMenuItem } from './BulletedListMenuItem';
import { IndentMenuItem } from './IndentMenuItem';
import { ListsIndentationMenu } from './ListsIndentationMenu';
import { MenuSection } from './MenuSection';
import { NumberedListMenuItem } from './NumberedListMenuItem';
import { OutdentMenuItem } from './OutdentMenuItem';
import { TaskListMenuItem } from './TaskListMenuItem';

export const getListsIndentationMenu = (
	allowHeadingAndParagraphIndentation: boolean,
	showIndentationButtons: boolean,
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: LISTS_INDENTATION_MENU.type,
			key: LISTS_INDENTATION_MENU.key,
			parents: [
				{
					type: LISTS_INDENTATION_GROUP.type,
					key: LISTS_INDENTATION_GROUP.key,
					rank: LISTS_INDENTATION_GROUP_RANK[LISTS_INDENTATION_MENU.key],
				},
				{
					type: LISTS_INDENTATION_GROUP_COLLAPSED.type,
					key: LISTS_INDENTATION_GROUP_COLLAPSED.key,
					rank: LISTS_INDENTATION_GROUP_COLLAPSED_RANK[LISTS_INDENTATION_MENU.key],
				},
				{
					type: LISTS_INDENTATION_GROUP_INLINE.type,
					key: LISTS_INDENTATION_GROUP_INLINE.key,
					rank: LISTS_INDENTATION_GROUP_COLLAPSED_RANK[LISTS_INDENTATION_MENU.key],
				},
			],
			component: ({ children }) => (
				<ListsIndentationMenu
					api={api}
					allowHeadingAndParagraphIndentation={allowHeadingAndParagraphIndentation}
				>
					{children}
				</ListsIndentationMenu>
			),
		},
		{
			type: LISTS_INDENTATION_MENU_SECTION.type,
			key: LISTS_INDENTATION_MENU_SECTION.key,
			parents: [
				{
					type: LISTS_INDENTATION_MENU.type,
					key: LISTS_INDENTATION_MENU.key,
					rank: LISTS_INDENTATION_MENU_RANK[LISTS_INDENTATION_MENU_SECTION.key],
				},
				...(expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
					? [
							{
								type: TEXT_COLLAPSED_MENU.type,
								key: TEXT_COLLAPSED_MENU.key,
								rank: TEXT_COLLAPSED_MENU_RANK[LISTS_INDENTATION_MENU_SECTION.key],
							},
						]
					: []),
			],
			component: expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
				? MenuSection
				: undefined,
		},
		{
			type: BULLETED_LIST_MENU_ITEM.type,
			key: BULLETED_LIST_MENU_ITEM.key,
			parents: [
				{
					type: LISTS_INDENTATION_MENU_SECTION.type,
					key: LISTS_INDENTATION_MENU_SECTION.key,
					rank: LISTS_INDENTATION_MENU_SECTION_RANK[BULLETED_LIST_MENU_ITEM.key],
				},
			],
			component: ({ parents }) => <BulletedListMenuItem api={api} parents={parents} />,
		},
		{
			type: NUMBERED_LIST_MENU_ITEM.type,
			key: NUMBERED_LIST_MENU_ITEM.key,
			parents: [
				{
					type: LISTS_INDENTATION_MENU_SECTION.type,
					key: LISTS_INDENTATION_MENU_SECTION.key,
					rank: LISTS_INDENTATION_MENU_SECTION_RANK[NUMBERED_LIST_MENU_ITEM.key],
				},
			],
			component: ({ parents }) => <NumberedListMenuItem api={api} parents={parents} />,
		},
		...(!expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true)
			? [
					{
						type: TASK_LIST_MENU_ITEM.type,
						key: TASK_LIST_MENU_ITEM.key,
						parents: [
							{
								type: LISTS_INDENTATION_MENU_SECTION.type,
								key: LISTS_INDENTATION_MENU_SECTION.key,
								rank: LISTS_INDENTATION_MENU_SECTION_RANK[TASK_LIST_MENU_ITEM.key],
							},
						],
						component: ({ parents }: { parents: ToolbarComponentTypes }) => (
							<TaskListMenuItem api={api} parents={parents} />
						),
					},
				]
			: []),
		{
			type: OUTDENT_MENU_ITEM.type,
			key: OUTDENT_MENU_ITEM.key,
			parents: [
				{
					type: LISTS_INDENTATION_MENU_SECTION.type,
					key: LISTS_INDENTATION_MENU_SECTION.key,
					rank: LISTS_INDENTATION_MENU_SECTION_RANK[OUTDENT_MENU_ITEM.key],
				},
			],
			component: ({ parents }) => (
				<OutdentMenuItem
					api={api}
					allowHeadingAndParagraphIndentation={allowHeadingAndParagraphIndentation}
					showIndentationButtons={showIndentationButtons}
					parents={parents}
				/>
			),
		},
		{
			type: INDENT_MENU_ITEM.type,
			key: INDENT_MENU_ITEM.key,
			parents: [
				{
					type: LISTS_INDENTATION_MENU_SECTION.type,
					key: LISTS_INDENTATION_MENU_SECTION.key,
					rank: LISTS_INDENTATION_MENU_SECTION_RANK[INDENT_MENU_ITEM.key],
				},
			],
			component: ({ parents }) => (
				<IndentMenuItem
					api={api}
					allowHeadingAndParagraphIndentation={allowHeadingAndParagraphIndentation}
					showIndentationButtons={showIndentationButtons}
					parents={parents}
				/>
			),
		},
	];
};
