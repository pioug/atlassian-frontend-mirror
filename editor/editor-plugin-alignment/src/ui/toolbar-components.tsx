import React from 'react';

import {
	ALIGNMENT_GROUP,
	ALIGNMENT_GROUP_RANK,
	ALIGNMENT_MENU,
	ALIGNMENT_MENU_SECTION,
	TEXT_SECTION,
	TEXT_SECTION_RANK,
	ALIGNMENT_MENU_RANK,
	TEXT_COLLAPSED_MENU_RANK,
	TEXT_COLLAPSED_MENU,
	TEXT_SECTION_PRIMARY_TOOLBAR,
	TEXT_SECTION_PRIMARY_TOOLBAR_RANK,
} from '@atlaskit/editor-common/toolbar';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type AlignmentPlugin } from '../alignmentPluginType';
import type { AlignmentState } from '../pm-plugins/types';

import { AlignmentMenu } from './Toolbar/AlignmentMenu';
import { AlignmentMenuItem } from './Toolbar/AlignmentMenuItem';
import { MenuSection } from './Toolbar/MenuSection';
import { alignmentOptions } from './Toolbar/options';

const getAlignmentMenuItems = (
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined,
): RegisterComponent[] => {
	return Object.entries(alignmentOptions()).map(([alignment, item]) => {
		const { key, type, rank } = item;
		return {
			type,
			key,
			parents: [
				{
					type: ALIGNMENT_MENU_SECTION.type,
					key: ALIGNMENT_MENU_SECTION.key,
					rank,
				},
			],
			component: ({ parents }) => {
				return (
					<AlignmentMenuItem
						api={api}
						option={item}
						alignment={alignment as AlignmentState}
						parents={parents}
					/>
				);
			},
		};
	});
};

export const getToolbarComponents = (
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined,
): RegisterComponent[] => {
	return [
		{
			type: ALIGNMENT_GROUP.type,
			key: ALIGNMENT_GROUP.key,
			parents: expValEquals('platform_editor_toolbar_aifc_responsiveness_update', 'isEnabled', true)
				? [
						{
							type: TEXT_SECTION.type,
							key: TEXT_SECTION.key,
							rank: TEXT_SECTION_RANK[ALIGNMENT_GROUP.key],
						},
						{
							type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
							key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
							rank: TEXT_SECTION_PRIMARY_TOOLBAR_RANK[ALIGNMENT_GROUP.key],
						},
					]
				: [
						{
							type: TEXT_SECTION.type,
							key: TEXT_SECTION.key,
							rank: TEXT_SECTION_RANK[ALIGNMENT_GROUP.key],
						},
					],
		},
		{
			type: ALIGNMENT_MENU.type,
			key: ALIGNMENT_MENU.key,
			parents: [
				{
					type: ALIGNMENT_GROUP.type,
					key: ALIGNMENT_GROUP.key,
					rank: ALIGNMENT_GROUP_RANK[ALIGNMENT_MENU.key],
				},
			],
			component: ({ children }) => {
				return <AlignmentMenu api={api}>{children}</AlignmentMenu>;
			},
		},
		{
			type: ALIGNMENT_MENU_SECTION.type,
			key: ALIGNMENT_MENU_SECTION.key,
			parents: [
				{
					type: ALIGNMENT_MENU.type,
					key: ALIGNMENT_MENU.key,
					rank: ALIGNMENT_MENU_RANK[ALIGNMENT_MENU_SECTION.key],
				},
				...(expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
					? [
							{
								type: TEXT_COLLAPSED_MENU.type,
								key: TEXT_COLLAPSED_MENU.key,
								rank: TEXT_COLLAPSED_MENU_RANK[ALIGNMENT_MENU_SECTION.key],
							},
						]
					: []),
			],
			component: expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
				? MenuSection
				: undefined,
		},
		...getAlignmentMenuItems(api),
	];
};
