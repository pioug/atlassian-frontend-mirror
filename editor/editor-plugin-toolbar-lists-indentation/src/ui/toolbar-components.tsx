import React from 'react';

import {
	BULLETED_LIST_MENU_ITEM,
	INDENT_MENU_ITEM,
	LISTS_INDENTATION_GROUP,
	LISTS_INDENTATION_HERO_BUTTON,
	LISTS_INDENTATION_MENU,
	LISTS_INDENTATION_MENU_SECTION,
	NUMBERED_LIST_MENU_ITEM,
	OUTDENT_MENU_ITEM,
	TEXT_SECTION,
	TEXT_SECTION_RANK,
	LISTS_INDENTATION_GROUP_RANK,
	LISTS_INDENTATION_MENU_RANK,
	LISTS_INDENTATION_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../toolbarListsIndentationPluginType';

import { BulletedListMenuItem } from './toolbar-components/BulletedListMenuItem';
import { IndentMenuItem } from './toolbar-components/IndentMenuItem';
import { ListsIndentationHeroButton } from './toolbar-components/ListsIndentationHeroButton';
import { ListsIndentationMenu } from './toolbar-components/ListsIndentationMenu';
import { NumberedListMenuItem } from './toolbar-components/NumberedListMenuItem';
import { OutdentMenuItem } from './toolbar-components/OutdentMenuItem';

type GetToolbarComponentsProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	showIndentationButtons: boolean;
	allowHeadingAndParagraphIndentation: boolean;
};

export const getToolbarComponents = ({
	api,
	showIndentationButtons,
	allowHeadingAndParagraphIndentation,
}: GetToolbarComponentsProps): RegisterComponent[] => {
	return [
		{
			type: LISTS_INDENTATION_GROUP.type,
			key: LISTS_INDENTATION_GROUP.key,
			parents: [
				{
					type: TEXT_SECTION.type,
					key: TEXT_SECTION.key,
					rank: TEXT_SECTION_RANK[LISTS_INDENTATION_GROUP.key],
				},
			],
		},
		{
			type: LISTS_INDENTATION_HERO_BUTTON.type,
			key: LISTS_INDENTATION_HERO_BUTTON.key,
			parents: [
				{
					type: LISTS_INDENTATION_GROUP.type,
					key: LISTS_INDENTATION_GROUP.key,
					rank: LISTS_INDENTATION_GROUP_RANK[LISTS_INDENTATION_HERO_BUTTON.key],
				},
			],
			component: ({ parents }) => <ListsIndentationHeroButton api={api} parents={parents} />,
		},
		{
			type: LISTS_INDENTATION_MENU.type,
			key: LISTS_INDENTATION_MENU.key,
			parents: [
				{
					type: LISTS_INDENTATION_GROUP.type,
					key: LISTS_INDENTATION_GROUP.key,
					rank: LISTS_INDENTATION_GROUP_RANK[LISTS_INDENTATION_MENU.key],
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
			],
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
