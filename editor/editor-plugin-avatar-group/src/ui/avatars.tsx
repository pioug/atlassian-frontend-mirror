/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { AnalyticsEvent } from '@atlaskit/analytics-next';
import AvatarGroup from '@atlaskit/avatar-group';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { CollabParticipant } from '@atlaskit/editor-common/collab';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { ReadOnlyParticipants } from '@atlaskit/editor-plugin-collab-edit';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AvatarGroupPlugin } from '../plugin';

import { avatarContainerStyles } from './styles';
import toAvatar from './to-avatar';

export interface AvatarsProps {
	sessionId?: string;
	participants: ReadOnlyParticipants | undefined;
	editorView?: EditorView;
	featureFlags: FeatureFlags;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editorAPI: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
	children: ReactNode;
}

export const scrollToCollabCursor = (
	editorAPI: ExtractInjectionAPI<AvatarGroupPlugin> | undefined,
	participants: CollabParticipant[],
	sessionId: string | undefined,
	// analytics: AnalyticsEvent | undefined,
	index: number,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
	const selectedUser = participants[index];
	const cursorPos = selectedUser.cursorPos;
	if (selectedUser && cursorPos !== undefined && selectedUser.sessionId !== sessionId) {
		const analyticsPayload: AnalyticsEventPayload = {
			action: ACTION.MATCHED,
			actionSubject: ACTION_SUBJECT.SELECTION,
			eventType: EVENT_TYPE.TRACK,
		};

		editorAPI?.core?.actions?.execute(({ tr }) => {
			tr.setSelection(Selection.near(tr.doc.resolve(cursorPos)));
			editorAnalyticsAPI?.attachAnalyticsEvent(analyticsPayload)(tr);
			tr.scrollIntoView();
			return tr;
		});

		editorAPI?.core?.actions?.focus();
	}
};

export const Avatars = React.memo((props: AvatarsProps) => {
	const { sessionId, featureFlags, editorAPI } = props;
	const participants = props.participants?.toArray() as CollabParticipant[];
	const avatars = participants
		.sort((p) => (p.sessionId === sessionId ? -1 : 1))
		.map((participant) => toAvatar(participant, editorAPI));

	if (!avatars.length) {
		return null;
	}

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={avatarContainerStyles}>
			<AvatarGroup
				appearance="stack"
				size="medium"
				data={avatars}
				maxCount={3}
				onAvatarClick={(
					_event: React.MouseEvent,
					_analytics: AnalyticsEvent | undefined,
					index: number,
				) => {
					const allowCollabAvatarScroll = featureFlags?.collabAvatarScroll;

					// user does not need to scroll to their own position (index 0)
					if (allowCollabAvatarScroll && index > 0) {
						scrollToCollabCursor(
							editorAPI,
							participants,
							props.sessionId,
							index,
							props.editorAnalyticsAPI,
						);
					}
				}}
			/>
			{props.children}
		</div>
	);
});
