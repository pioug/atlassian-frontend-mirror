import React from 'react';

import {
	OVERFLOW_GROUP,
	OVERFLOW_GROUP_RANK,
	OVERFLOW_MENU,
	OVERFLOW_SECTION,
	OVERFLOW_SECTION_RANK,
	TEXT_SECTION,
	TOOLBAR_RANK,
	TOOLBARS,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PrimaryToolbar, Toolbar } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { ToolbarPlugin } from '../toolbarPluginType';

import { TOOLBAR_LABEL } from './consts';
import { OverflowMenu } from './OverflowMenu';
import { TextSection } from './TextSection';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<ToolbarPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: 'toolbar',
			key: TOOLBARS.INLINE_TEXT_TOOLBAR,
			component: ({ children }) => {
				return <Toolbar label={TOOLBAR_LABEL}>{children}</Toolbar>;
			},
		},
		{
			type: 'toolbar',
			key: TOOLBARS.PRIMARY_TOOLBAR,
			component: ({ children }) => (
				<PrimaryToolbar label="Primary Toolbar">{children}</PrimaryToolbar>
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
				return (
					<TextSection parents={parents} api={api}>
						{children}
					</TextSection>
				);
			},
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
	];
};
