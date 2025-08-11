import React from 'react';

import {
	LINKING_BUTTON,
	LINKING_GROUP,
	LINKING_GROUP_RANK,
	LINKING_SECTION,
	LINKING_SECTION_RANK,
	TOOLBAR_RANK,
	TOOLBARS,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { HyperlinkPlugin } from '../hyperlinkPluginType';

import { LinkButton } from './toolbar/LinkButton';
import { LinkSection } from './toolbar/LinkSection';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<HyperlinkPlugin>,
): RegisterComponent[] => {
	const toolbarComponents: RegisterComponent[] = [
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
			component: ({ children, parents }) => {
				return (
					<LinkSection parents={parents} api={api}>
						{children}
					</LinkSection>
				);
			},
		},
		{
			type: LINKING_GROUP.type,
			key: LINKING_GROUP.key,
			parents: [
				{
					type: LINKING_SECTION.type,
					key: LINKING_SECTION.key,
					rank: LINKING_SECTION_RANK[LINKING_GROUP.key],
				},
			],
		},
		{
			type: LINKING_BUTTON.type,
			key: LINKING_BUTTON.key,
			parents: [
				{
					type: LINKING_GROUP.type,
					key: LINKING_GROUP.key,
					rank: LINKING_GROUP_RANK[LINKING_BUTTON.key],
				},
			],
			component: () => {
				return <LinkButton api={api} />;
			},
		},
	];

	return toolbarComponents;
};
