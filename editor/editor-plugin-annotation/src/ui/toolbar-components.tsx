import React from 'react';

import {
	TOOLBARS,
	COLLAB_SECTION,
	COMMENT_GROUP,
	COMMENT_HERO_BUTTON,
} from '@atlaskit/editor-common/toolbar/keys';
import { TOOLBAR_RANK, COLLAB_SECTION_RANK } from '@atlaskit/editor-common/toolbar/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';

import type { AnnotationPlugin } from '../annotationPluginType';
import type { AnnotationProviders } from '../types';
import { CommentButton } from './CommentButton/CommentButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<AnnotationPlugin>,
	annotationProviders?: AnnotationProviders,
): RegisterComponent[] => {
	return [
		{
			type: COLLAB_SECTION.type,
			key: COLLAB_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[COLLAB_SECTION.key],
				},
			],
		},
		{
			type: COMMENT_GROUP.type,
			key: COMMENT_GROUP.key,
			parents: [
				{
					type: COLLAB_SECTION.type,
					key: COLLAB_SECTION.key,
					rank: TOOLBAR_RANK[COLLAB_SECTION.key],
				},
			],
		},
		{
			type: COMMENT_HERO_BUTTON.type,
			key: COMMENT_HERO_BUTTON.key,
			parents: [
				{
					type: COMMENT_GROUP.type,
					key: COMMENT_GROUP.key,
					rank: COLLAB_SECTION_RANK[COMMENT_GROUP.key],
				},
			],
			component: () => {
				return <CommentButton api={api} annotationProviders={annotationProviders} />;
			},
		},
	];
};
