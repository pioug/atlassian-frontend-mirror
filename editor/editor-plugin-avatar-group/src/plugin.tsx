import React from 'react';

import type { CollabEditOptions, CollabInviteToEditProps } from '@atlaskit/editor-common/collab';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';
import AvatarsWithPluginState from './ui/avatars-with-plugin-state';

type Config = {
	collabEdit?: CollabEditOptions;
	takeFullWidth: boolean;
	showAvatarGroup?: boolean;
};

export type AvatarGroupPlugin = NextEditorPlugin<
	'avatarGroup',
	{
		pluginConfiguration: Config;
		dependencies: [
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<CollabEditPlugin>,
		];
		actions: {
			getToolbarItem: ({
				editorView,
				inviteToEditHandler,
				isInviteToEditButtonSelected,
				inviteToEditComponent,
			}: {
				editorView: EditorView;
			} & CollabInviteToEditProps) => JSX.Element | null;
		};
	}
>;

export const avatarGroupPlugin: AvatarGroupPlugin = ({ config: props, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	return {
		name: 'avatarGroup',

		primaryToolbarComponent: props.showAvatarGroup
			? ({
					editorView,
					popupsMountPoint,
					popupsBoundariesElement,
					popupsScrollableElement,
					disabled,
					isToolbarReducedSpacing,
					eventDispatcher,
					dispatchAnalyticsEvent,
				}) => {
					return (
						<AvatarGroupPluginWrapper
							dispatchAnalyticsEvent={dispatchAnalyticsEvent}
							editorView={editorView}
							eventDispatcher={eventDispatcher}
							collabEdit={props?.collabEdit}
							takeFullWidth={props?.takeFullWidth}
							featureFlags={featureFlags}
							editorAnalyticsAPI={api?.analytics?.actions}
							editorAPI={api}
						/>
					);
				}
			: undefined,
		actions: {
			getToolbarItem: ({
				editorView,
				inviteToEditHandler,
				isInviteToEditButtonSelected,
				inviteToEditComponent,
			}) => {
				return (
					<AvatarsWithPluginState
						editorView={editorView}
						featureFlags={api?.featureFlags?.sharedState.currentState() ?? {}}
						editorAnalyticsAPI={api?.analytics?.actions}
						editorAPI={api}
						inviteToEditHandler={inviteToEditHandler}
						isInviteToEditButtonSelected={isInviteToEditButtonSelected}
						inviteToEditComponent={inviteToEditComponent}
					/>
				);
			},
		},
	};
};
