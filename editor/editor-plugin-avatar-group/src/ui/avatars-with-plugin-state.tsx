import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import messages from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { CollabInviteToEditProps } from '@atlaskit/editor-plugin-collab-edit';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';

import { Avatars } from './avatars';
import { InviteToEditButton } from './invite-to-edit';

export type AvatarsWithPluginStateProps = {
	editorView?: EditorView;
	eventDispatcher?: EventDispatcher;
	featureFlags: FeatureFlags;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editorAPI: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
} & CollabInviteToEditProps;

const AvatarsWithPluginState = (props: AvatarsWithPluginStateProps & WrappedComponentProps) => {
	const title = props.intl.formatMessage(messages.inviteToEditButtonTitle);

	const {
		isInviteToEditButtonSelected: selected,
		inviteToEditHandler: onClick,
		inviteToEditComponent: Component,
		editorView,
		featureFlags,
		editorAnalyticsAPI,
		editorAPI,
	} = props;

	const { collabEditState } = useSharedPluginState(editorAPI, ['collabEdit']);

	if (!collabEditState) {
		return null;
	}

	return (
		<Avatars
			sessionId={collabEditState.sessionId}
			participants={collabEditState.activeParticipants}
			editorView={editorView}
			featureFlags={featureFlags}
			editorAnalyticsAPI={editorAnalyticsAPI}
			editorAPI={editorAPI}
		>
			<InviteToEditButton
				title={title}
				selected={selected}
				onClick={onClick}
				Component={Component}
			/>
		</Avatars>
	);
};

export default injectIntl(AvatarsWithPluginState);
