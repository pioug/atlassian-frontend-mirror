import React from 'react';

import {
	INSERT_BLOCK_SECTION,
	LINKING_SECTION,
	OVERFLOW_GROUP,
	OVERFLOW_GROUP_PRIMARY_TOOLBAR,
	OVERFLOW_GROUP_PRIMARY_TOOLBAR_RANK,
	OVERFLOW_GROUP_RANK,
	OVERFLOW_MENU,
	OVERFLOW_MENU_PRIMARY_TOOLBAR,
	OVERFLOW_SECTION,
	OVERFLOW_SECTION_PRIMARY_TOOLBAR,
	OVERFLOW_SECTION_PRIMARY_TOOLBAR_RANK,
	OVERFLOW_SECTION_RANK,
	PIN_SECTION,
	TEXT_COLLAPSED_GROUP,
	TEXT_SECTION,
	TEXT_SECTION_COLLAPSED,
	TEXT_COLLAPSED_MENU,
	TOOLBAR_RANK,
	TOOLBARS,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PrimaryToolbar as PrimaryToolbarBase, Show, Toolbar } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ToolbarPlugin } from '../toolbarPluginType';

import { SELECTION_TOOLBAR_LABEL } from './consts';
import { OverflowMenu } from './OverflowMenu';
import { OverflowSection } from './OverflowSection';
import { PrimaryToolbar } from './PrimaryToolbar';
import { Section } from './Section';
import { TextCollapsedMenu } from './TextCollapsedMenu';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<ToolbarPlugin>,
	disableSelectionToolbar?: boolean,
): RegisterComponent[] => {
	const components: RegisterComponent[] = [
		{
			type: 'toolbar',
			key: TOOLBARS.INLINE_TEXT_TOOLBAR,
			component: ({ children }) => {
				return <Toolbar label={SELECTION_TOOLBAR_LABEL}>{children}</Toolbar>;
			},
		},
		{
			type: 'toolbar',
			key: TOOLBARS.PRIMARY_TOOLBAR,
			component: expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
				? PrimaryToolbar
				: ({ children }) => (
						<PrimaryToolbarBase label="Primary Toolbar">{children}</PrimaryToolbarBase>
					),
		},
		{
			type: TEXT_SECTION.type,
			key: TEXT_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[TEXT_SECTION.key],
				},
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[TEXT_SECTION.key],
				},
			],
			component: ({ children, parents }) => {
				if (expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)) {
					return (
						<Show above="md">
							<Section
								parents={parents}
								api={api}
								disableSelectionToolbar={disableSelectionToolbar}
								testId="text-section"
							>
								{children}
							</Section>
						</Show>
					);
				}

				return (
					<Section
						parents={parents}
						api={api}
						disableSelectionToolbar={disableSelectionToolbar}
						testId="text-section"
					>
						{children}
					</Section>
				);
			},
		},
		...(expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
			? ([
					{
						type: TEXT_SECTION_COLLAPSED.type,
						key: TEXT_SECTION_COLLAPSED.key,
						parents: [
							{
								type: 'toolbar' as const,
								key: TOOLBARS.INLINE_TEXT_TOOLBAR,
								rank: TOOLBAR_RANK[TEXT_SECTION_COLLAPSED.key],
							},
							{
								type: 'toolbar' as const,
								key: TOOLBARS.PRIMARY_TOOLBAR,
								rank: TOOLBAR_RANK[TEXT_SECTION_COLLAPSED.key],
							},
						],
						component: ({ children, parents }) => {
							return (
								<Show below="md">
									<Section
										parents={parents}
										api={api}
										disableSelectionToolbar={disableSelectionToolbar}
										testId="text-section"
									>
										{children}
									</Section>
								</Show>
							);
						},
					},
					{
						type: TEXT_COLLAPSED_GROUP.type,
						key: TEXT_COLLAPSED_GROUP.key,
						parents: [
							{
								type: TEXT_SECTION_COLLAPSED.type,
								key: TEXT_SECTION_COLLAPSED.key,
								rank: 100,
							},
						],
					},
					{
						type: TEXT_COLLAPSED_MENU.type,
						key: TEXT_COLLAPSED_MENU.key,
						parents: [
							{
								type: TEXT_COLLAPSED_GROUP.type,
								key: TEXT_COLLAPSED_GROUP.key,
								rank: 100,
							},
						],
						component: TextCollapsedMenu,
					},
				] as RegisterComponent[])
			: []),

		{
			type: INSERT_BLOCK_SECTION.type,
			key: INSERT_BLOCK_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[INSERT_BLOCK_SECTION.key],
				},
			],
			component: ({ children, parents }) => (
				<Section
					testId="insert-block-section"
					parents={parents}
					api={api}
					showSeparatorInFullPagePrimaryToolbar
					isSharedSection={false}
				>
					{children}
				</Section>
			),
		},
		{
			type: LINKING_SECTION.type,
			key: LINKING_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[LINKING_SECTION.key],
				},
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[LINKING_SECTION.key],
				},
			],
			component: ({ children, parents }) => (
				<Section
					testId="link-section"
					parents={parents}
					api={api}
					showSeparatorInFullPagePrimaryToolbar
				>
					{children}
				</Section>
			),
		},
		{
			type: OVERFLOW_SECTION.type,
			key: OVERFLOW_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[OVERFLOW_SECTION.key],
				},
			],
		},
		{
			type: OVERFLOW_GROUP.type,
			key: OVERFLOW_GROUP.key,
			parents: [
				{
					type: OVERFLOW_SECTION.type,
					key: OVERFLOW_SECTION.key,
					rank: OVERFLOW_SECTION_RANK[OVERFLOW_GROUP.key],
				},
			],
		},
		{
			type: OVERFLOW_MENU.type,
			key: OVERFLOW_MENU.key,
			parents: [
				{
					type: OVERFLOW_GROUP.type,
					key: OVERFLOW_GROUP.key,
					rank: OVERFLOW_GROUP_RANK[OVERFLOW_MENU.key],
				},
			],
			component: ({ children }) => {
				return <OverflowMenu>{children}</OverflowMenu>;
			},
		},
		{
			type: PIN_SECTION.type,
			key: PIN_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[PIN_SECTION.key],
				},
			],
		},
	];

	if (expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true)) {
		components.push(
			{
				type: OVERFLOW_SECTION_PRIMARY_TOOLBAR.type,
				key: OVERFLOW_SECTION_PRIMARY_TOOLBAR.key,
				parents: [
					{
						type: 'toolbar',
						key: TOOLBARS.PRIMARY_TOOLBAR,
						rank: TOOLBAR_RANK[OVERFLOW_SECTION_PRIMARY_TOOLBAR.key],
					},
				],
				component: ({ children }) => {
					return <OverflowSection>{children}</OverflowSection>;
				},
			},
			{
				type: OVERFLOW_GROUP_PRIMARY_TOOLBAR.type,
				key: OVERFLOW_GROUP_PRIMARY_TOOLBAR.key,
				parents: [
					{
						type: OVERFLOW_SECTION_PRIMARY_TOOLBAR.type,
						key: OVERFLOW_SECTION_PRIMARY_TOOLBAR.key,
						rank: OVERFLOW_SECTION_PRIMARY_TOOLBAR_RANK[OVERFLOW_GROUP_PRIMARY_TOOLBAR.key],
					},
				],
			},
			{
				type: OVERFLOW_MENU_PRIMARY_TOOLBAR.type,
				key: OVERFLOW_MENU_PRIMARY_TOOLBAR.key,
				parents: [
					{
						type: OVERFLOW_GROUP_PRIMARY_TOOLBAR.type,
						key: OVERFLOW_GROUP_PRIMARY_TOOLBAR.key,
						rank: OVERFLOW_GROUP_PRIMARY_TOOLBAR_RANK[OVERFLOW_MENU_PRIMARY_TOOLBAR.key],
					},
				],
				component: ({ children }) => {
					return <OverflowMenu>{children}</OverflowMenu>;
				},
			},
		);
	}

	return components;
};
