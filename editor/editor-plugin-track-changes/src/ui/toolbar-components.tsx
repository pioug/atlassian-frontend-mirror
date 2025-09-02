import React from 'react';

import {
	TOOLBAR_RANK,
	TOOLBARS,
	TRACK_CHANGES_BUTTON,
	TRACK_CHANGES_GROUP,
	TRACK_CHANGES_GROUP_RANK,
	TRACK_CHANGES_SECTION_RANK_NEW,
	TRACK_CHANGES_SECTION,
	TRACK_CHANGES_SECTION_RANK,
	TRACK_CHANGES_GROUP_RANK_NEW,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TrackChangesPlugin } from '../trackChangesPluginType';

import { TrackChangesToolbarButton } from './TrackChangesToolbarButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<TrackChangesPlugin>,
): RegisterComponent[] => {
	return expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true)
		? [
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
							rank: TRACK_CHANGES_SECTION_RANK_NEW[TRACK_CHANGES_GROUP.key],
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
							rank: TRACK_CHANGES_GROUP_RANK_NEW[TRACK_CHANGES_BUTTON.key],
						},
					],
					component: () => <TrackChangesToolbarButton api={api} />,
				},
			]
		: [
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
					component: () => <TrackChangesToolbarButton api={api} />,
				},
			];
};
