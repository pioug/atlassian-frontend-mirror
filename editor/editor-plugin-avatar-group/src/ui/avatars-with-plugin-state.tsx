import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { CollabInviteToEditProps } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import messages from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

	const { collabEditState } = useSharedPluginState(editorAPI, ['collabEdit'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});

	// sessionId
	const sessionIdSelector = useSharedPluginStateSelector(editorAPI, 'collabEdit.sessionId', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const sessionId = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? sessionIdSelector
		: collabEditState?.sessionId;

	// activeParticipants
	const activeParticipantsSelector = useSharedPluginStateSelector(
		editorAPI,
		'collabEdit.activeParticipants',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const activeParticipants = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? activeParticipantsSelector
		: collabEditState?.activeParticipants;

	const initialised = useSharedPluginStateSelector(editorAPI, 'collabEdit.initialised', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});

	if (!collabEditState && editorExperiment('platform_editor_usesharedpluginstateselector', false)) {
		return null;
	}

	if (!initialised && editorExperiment('platform_editor_usesharedpluginstateselector', true)) {
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
