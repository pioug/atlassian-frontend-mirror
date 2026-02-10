import React from 'react';

import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar';
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
	TEXT_SECTION_PRIMARY_TOOLBAR,
	TEXT_SECTION_COLLAPSED,
	TEXT_COLLAPSED_MENU,
	TOOLBAR_RANK,
	TOOLBARS,
	TRACK_CHANGES_SECTION,
	OVERFLOW_EXTENSIONS_MENU_SECTION,
	OVERFLOW_MENU_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Show, Toolbar, type BreakpointPreset } from '@atlaskit/editor-toolbar';
import { type RegisterComponent, type ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarPlugin } from '../toolbarPluginType';

import { SELECTION_TOOLBAR_LABEL } from './consts';
import { OverflowMenu } from './OverflowMenu';
import { OverflowMenuSection } from './OverflowMenuSection';
import { OverflowSection } from './OverflowSection';
import { PrimaryToolbar } from './PrimaryToolbar';
import { Section } from './Section';
import { TextCollapsedMenu } from './TextCollapsedMenu';

const getInlineTextToolbarComponents = () => {
	return [
		{
			type: 'toolbar',
			key: TOOLBARS.INLINE_TEXT_TOOLBAR,
			component: ({ children }) => {
				return (
					<Toolbar
						label={SELECTION_TOOLBAR_LABEL}
						actionSubjectId={ACTION_SUBJECT_ID.SELECTION_TOOLBAR}
						testId={'editor-floating-toolbar'}
					>
						{children}
					</Toolbar>
				);
			},
		},
	] as RegisterComponent[];
};

const getPrimaryToolbarComponents = (breakpointPreset?: BreakpointPreset) => {
	return [
		{
			type: 'toolbar',
			key: TOOLBARS.PRIMARY_TOOLBAR,
			component: ({ children }) => (
				<PrimaryToolbar breakpointPreset={breakpointPreset}>{children}</PrimaryToolbar>
			),
		},
	] as RegisterComponent[];
};

export const getToolbarComponents = (
	contextualFormattingEnabled: ContextualFormattingEnabledOptions,
	api?: ExtractInjectionAPI<ToolbarPlugin>,
	breakpointPreset?: BreakpointPreset,
): RegisterComponent[] => {
	const components: RegisterComponent[] = [
		{
			type: TEXT_SECTION.type,
			key: TEXT_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[TEXT_SECTION.key],
				},
			],
			component: ({ children, parents }) => {
				return (
					<Show above="md">
						<Section parents={parents} api={api} testId="text-section">
							{children}
						</Section>
					</Show>
				);
			},
		},
		{
			type: TEXT_SECTION_PRIMARY_TOOLBAR.type,
			key: TEXT_SECTION_PRIMARY_TOOLBAR.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[TEXT_SECTION.key],
				},
			],
			component: ({
				children,
				parents,
			}: {
				children: React.ReactNode;
				parents: ToolbarComponentTypes;
			}) => {
				return (
					<Show above="md">
						<Section parents={parents} api={api} testId="text-section">
							{children}
						</Section>
					</Show>
				);
			},
		},

		{
			type: TEXT_SECTION_COLLAPSED.type,
			key: TEXT_SECTION_COLLAPSED.key,
			parents: [
				{
					type: 'toolbar' as const,
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[TEXT_SECTION_COLLAPSED.key],
				},

				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[TEXT_SECTION_COLLAPSED.key],
				},
			],
			component: ({ children, parents }) => {
				return (
					<Show below="md">
						<Section parents={parents} api={api} testId="text-section">
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
			type: OVERFLOW_EXTENSIONS_MENU_SECTION.type,
			key: OVERFLOW_EXTENSIONS_MENU_SECTION.key,
			parents: [
				{
					type: OVERFLOW_MENU.type,
					key: OVERFLOW_MENU.key,
					rank: OVERFLOW_MENU_RANK[OVERFLOW_EXTENSIONS_MENU_SECTION.key],
				},
			],
			component: OverflowMenuSection,
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
			component: ({ children, parents }) => {
				return (
					<Section
						testId="pin-section"
						parents={parents}
						api={api}
						showSeparatorInFullPagePrimaryToolbar
					>
						{children}
					</Section>
				);
			},
		},
	];

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

	switch (contextualFormattingEnabled) {
		case 'always-inline':
			components.unshift(...getInlineTextToolbarComponents());
			break;
		case 'always-pinned':
			components.unshift(...getPrimaryToolbarComponents(breakpointPreset));
			break;
		case 'controlled':
			components.unshift(...getInlineTextToolbarComponents());
			components.unshift(...getPrimaryToolbarComponents(breakpointPreset));
			break;
	}

	components.push({
		type: TRACK_CHANGES_SECTION.type,
		key: TRACK_CHANGES_SECTION.key,
		parents: [
			{
				type: 'toolbar',
				key: TOOLBARS.PRIMARY_TOOLBAR,
				rank: TOOLBAR_RANK[TRACK_CHANGES_SECTION.key],
			},
		],
		component: ({ children, parents }) => {
			return (
				<Section
					testId="track-changes-section"
					parents={parents}
					api={api}
					showSeparatorInFullPagePrimaryToolbar
				>
					{children}
				</Section>
			);
		},
	});

	return components;
};
