import React from 'react';

import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import type { AvatarGroupPlugin } from './avatarGroupPluginType';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';
import AvatarsWithPluginState from './ui/avatars-with-plugin-state';

export const avatarGroupPlugin: AvatarGroupPlugin = ({ config: props, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
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
	};
	if (props.showAvatarGroup) {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'avatarGroup',
			component: primaryToolbarComponent,
		});
	}

	return {
		name: 'avatarGroup',

		primaryToolbarComponent:
			!api?.primaryToolbar && props.showAvatarGroup ? primaryToolbarComponent : undefined,

		actions: {
			getToolbarItem: ({
				inviteToEditHandler,
				isInviteToEditButtonSelected,
				inviteToEditComponent,
			}) => {
				return (
					<AvatarsWithPluginState
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
