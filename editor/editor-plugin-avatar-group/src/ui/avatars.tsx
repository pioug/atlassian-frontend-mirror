/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl';

import type AnalyticsEvent from '@atlaskit/analytics-next/AnalyticsEvent';
import AvatarGroup from '@atlaskit/avatar-group/avatar-group';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { CollabParticipant } from '@atlaskit/editor-common/collab';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { ReadOnlyParticipants } from '@atlaskit/editor-plugin-collab-edit';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';
import { fetchUserNames } from '../services/fetch-user-names';
import { avatarContainerStyles } from './styles';
import toAvatar from './to-avatar';

interface AvatarsProps {
	children: ReactNode;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editorAPI: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
	editorView?: EditorView;
	featureFlags: FeatureFlags;
	participants: ReadOnlyParticipants | undefined;
	sessionId?: string;
}

const scrollToCollabCursor = (
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

const getMissingActingUserIdsKey = (
	participants: CollabParticipant[],
	userNamesById: Record<string, string>,
): string => {
	const participantUserIds = new Set<string>();
	const missingActingUserIds = new Set<string>();

	for (const participant of participants) {
		if (participant.userId) {
			participantUserIds.add(participant.userId);
		}
	}

	for (const participant of participants) {
		const actingUserId = participant.actingUserId;

		if (actingUserId && !participantUserIds.has(actingUserId) && !userNamesById[actingUserId]) {
			missingActingUserIds.add(actingUserId);
		}
	}

	let missingActingUserIdsKey = '';
	for (const actingUserId of missingActingUserIds) {
		missingActingUserIdsKey = missingActingUserIdsKey
			? `${missingActingUserIdsKey}|${actingUserId}`
			: actingUserId;
	}

	return missingActingUserIdsKey;
};

export const Avatars: React.MemoExoticComponent<(props: AvatarsProps) => jsx.JSX.Element | null> =
	React.memo((props: AvatarsProps): jsx.JSX.Element | null => {
		const { sessionId, featureFlags, editorAPI } = props;
		const intl = useIntl();
		const [userNamesById, setUserNamesById] = React.useState<Record<string, string>>({});
		// .slice() turns ReadonlyArray<CollabParticipant> into a mutable CollabParticipant[]
		const participants = props.participants?.toArray()?.slice();
		const missingActingUserIdsKey = React.useMemo((): string => {
			if (!participants || !fg('platform_move_presence_agents')) {
				return '';
			}

			return getMissingActingUserIdsKey(participants, userNamesById);
		}, [participants, userNamesById]);

		React.useEffect(() => {
			if (!missingActingUserIdsKey) {
				return;
			}

			let cancelled = false;

			fetchUserNames(missingActingUserIdsKey.split('|')).then((namesById) => {
				if (cancelled || !Object.keys(namesById).length) {
					return;
				}

				setUserNamesById((currentNamesById) => ({
					...currentNamesById,
					...namesById,
				}));
			});

			return () => {
				cancelled = true;
			};
		}, [missingActingUserIdsKey]);

		if (!participants) {
			return null;
		}

		// eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed)
		const avatars = participants
			.sort((p) => (p.sessionId === sessionId ? -1 : 1))
			.map((participant) =>
				toAvatar(participant, editorAPI, intl.formatMessage, participants, userNamesById),
			);

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
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
