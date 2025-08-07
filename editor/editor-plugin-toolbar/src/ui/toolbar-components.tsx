import React from 'react';

import {
	OVERFLOW_GROUP,
	OVERFLOW_GROUP_RANK,
	OVERFLOW_MENU,
	OVERFLOW_SECTION,
	OVERFLOW_SECTION_RANK,
	TOOLBAR_RANK,
	TOOLBARS,
} from '@atlaskit/editor-common/toolbar';
import { Toolbar } from '@atlaskit/editor-toolbar';
import { type RegisterComponent } from '@atlaskit/editor-toolbar-model';

import { TOOLBAR_LABEL } from './consts';
import { OverflowMenu } from './OverflowMenu';

export const getToolbarComponents = (): RegisterComponent[] => {
	return [
		{
			type: 'toolbar',
			key: TOOLBARS.INLINE_TEXT_TOOLBAR,
			component: ({ children }) => {
				return <Toolbar label={TOOLBAR_LABEL}>{children}</Toolbar>;
			},
		},
		{
			type: 'section',
			key: 'text-section',
			parents: [{ type: 'toolbar', key: 'inline-text-toolbar', rank: 200 }],
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
