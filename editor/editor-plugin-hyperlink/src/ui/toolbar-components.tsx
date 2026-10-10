import React from 'react';

import {
	LINKING_BUTTON,
	LINKING_GROUP,
	LINKING_SECTION,
} from '@atlaskit/editor-common/toolbar/keys';
import { LINKING_GROUP_RANK, LINKING_SECTION_RANK } from '@atlaskit/editor-common/toolbar/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';

import type { HyperlinkPlugin } from '../hyperlinkPluginType';
import { LinkButton } from './toolbar/LinkButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<HyperlinkPlugin>,
): RegisterComponent[] => {
	const toolbarComponents: RegisterComponent[] = [
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
