import React from 'react';

import {
	TOOLBAR_RANK,
	TOOLBARS,
	TRACK_CHANGES_BUTTON,
	TRACK_CHANGES_GROUP,
	TRACK_CHANGES_GROUP_RANK,
	TRACK_CHANGES_SECTION,
	TRACK_CHANGES_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { TrackChangesPlugin } from '../trackChangesPluginType';

import { TrackChangesButtonNew } from './TrackChangesButtonNew';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<TrackChangesPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: TRACK_CHANGES_SECTION.type,
			key: TRACK_CHANGES_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[TRACK_CHANGES_SECTION.key],
				},
			],
		},
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
			component: () => <TrackChangesButtonNew api={api} />,
		},
	];
};
