import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { CollabInviteToEditProps } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import messages from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	type CollabEditPluginSharedState,
	type ReadOnlyParticipants,
} from '@atlaskit/editor-plugin-collab-edit';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

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

const useAvatarsWithPluginState = sharedPluginStateHookMigratorFactory(
	(
		api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined,
	): {
		sessionId: string | undefined;
		activeParticipants: ReadOnlyParticipants | undefined;
		isInitialised: boolean | undefined;
		collabEditState: CollabEditPluginSharedState | undefined;
	} => {
		const sessionId = useSharedPluginStateSelector(api, 'collabEdit.sessionId');
		const activeParticipants = useSharedPluginStateSelector(api, 'collabEdit.activeParticipants');
		const initialised = useSharedPluginStateSelector(api, 'collabEdit.initialised');
		return {
			sessionId,
			activeParticipants,
			isInitialised: !!initialised,
			collabEditState: undefined,
		};
	},
	(api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined) => {
		const { collabEditState } = useSharedPluginState(api, ['collabEdit']);
		return {
			activeParticipants: collabEditState?.activeParticipants,
			sessionId: collabEditState?.sessionId,
			isInitialised: !!collabEditState?.initialised,
			collabEditState,
		};
	},
);

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

	const { sessionId, activeParticipants, isInitialised, collabEditState } =
		useAvatarsWithPluginState(editorAPI);

	if (!collabEditState && editorExperiment('platform_editor_usesharedpluginstateselector', false)) {
		return null;
	}

	if (!isInitialised && editorExperiment('platform_editor_usesharedpluginstateselector', true)) {
		return null;
	}

	return (
		<Avatars
			sessionId={sessionId}
			participants={activeParticipants}
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
