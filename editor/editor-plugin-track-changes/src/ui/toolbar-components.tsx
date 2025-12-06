import React from 'react';

import {
	TOOLBAR_RANK,
	TOOLBARS,
	TRACK_CHANGES_BUTTON,
	TRACK_CHANGES_GROUP,
	TRACK_CHANGES_SECTION_RANK,
	TRACK_CHANGES_SECTION,
	TRACK_CHANGES_GROUP_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { TrackChangesPlugin, TrackChangesPluginOptions } from '../trackChangesPluginType';

import { TrackChangesToolbarButton } from './TrackChangesToolbarButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<TrackChangesPlugin>,
	options?: TrackChangesPluginOptions,
): RegisterComponent[] => {
	return [
		...(fg('platform_editor_toolbar_aifc_undo_redo_confluence')
			? []
			: [
					{
						type: TRACK_CHANGES_SECTION.type,
						key: TRACK_CHANGES_SECTION.key,
						parents: [
							{
								type: 'toolbar' as const,
								key: TOOLBARS.PRIMARY_TOOLBAR,
								rank: TOOLBAR_RANK[TRACK_CHANGES_SECTION.key],
							},
						],
					},
				]),
		{
			type: TRACK_CHANGES_GROUP.type,
			key: TRACK_CHANGES_GROUP.key,
			parents: [
				{
					type: TRACK_CHANGES_SECTION.type,
					key: TRACK_CHANGES_SECTION.key,
					rank: TRACK_CHANGES_SECTION_RANK[TRACK_CHANGES_GROUP.key],
				},
			],
		},
		{
			type: TRACK_CHANGES_BUTTON.type,
			key: TRACK_CHANGES_BUTTON.key,
			parents: [
				{
					type: TRACK_CHANGES_GROUP.type,
					key: TRACK_CHANGES_GROUP.key,
					rank: TRACK_CHANGES_GROUP_RANK[TRACK_CHANGES_BUTTON.key],
				},
			],
			component: () => <TrackChangesToolbarButton api={api} wrapper={options?.ButtonWrapper} />,
		},
	];
};
