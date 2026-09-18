import React from 'react';

import memoizeOne, { type MemoizedFn } from 'memoize-one';
import type { IntlShape } from 'react-intl';

import type { AvatarProps } from '@atlaskit/avatar-group/types';
import type { CollabParticipant } from '@atlaskit/editor-common/collab';
import { avatarGroupMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';
import { ColoredAvatarItem } from './colored-avatar-item';

const getUserNameForAttribution = (
	participant: CollabParticipant,
	participants: CollabParticipant[],
	userNamesById: Record<string, string> = {},
): string | undefined => {
	const actingUserId = participant.actingUserId;
	if (!fg('platform_move_presence_agents') || !actingUserId) {
		return undefined;
	}

	const currentParticipantName = participants.find(
		(user) =>
			user.sessionId !== participant.sessionId && user.userId === actingUserId && user.isHydrated,
	)?.name;

	return currentParticipantName ?? userNamesById[actingUserId];
};

const getAvatarName = (
	participant: CollabParticipant,
	participants: CollabParticipant[],
	formatMessage: IntlShape['formatMessage'],
	userNamesById: Record<string, string>,
): string => {
	const participantName =
		participant.name || formatMessage(avatarGroupMessages.anonymousCollaborator);
	const userNameForAttribution = getUserNameForAttribution(
		participant,
		participants,
		userNamesById,
	);

	if (!userNameForAttribution) {
		return participantName;
	}

	return formatMessage(avatarGroupMessages.agentWithUser, {
		agentName: participantName,
		userName: userNameForAttribution,
	});
};

const toAvatar = (
	participant: CollabParticipant,
	api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined,
	formatMessage: IntlShape['formatMessage'],
	participants: CollabParticipant[],
	userNamesById: Record<string, string> = {},
): AvatarProps => ({
	name: getAvatarName(participant, participants, formatMessage, userNamesById),
	src: participant.avatar,
	size: 'medium',
	presence: (
		<ColoredAvatarItem
			api={api}
			name={participant.name}
			sessionId={participant.sessionId}
			presenceId={participant.presenceId}
		/>
	),
});

const _default_1: MemoizedFn<
	(
		participant: CollabParticipant,
		api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined,
		formatMessage: IntlShape['formatMessage'],
		participants: CollabParticipant[],
		userNamesById?: Record<string, string>,
	) => AvatarProps
> = memoizeOne(
	toAvatar,
	function participantEquals(
		[a, , , aParticipants, aUserNamesById = {}],
		[b, , , bParticipants, bUserNamesById = {}],
	) {
		const actingUserId = a.actingUserId;

		return (
			a.name === b.name &&
			a.avatar === b.avatar &&
			a.sessionId === b.sessionId &&
			actingUserId === b.actingUserId &&
			(!actingUserId ||
				getUserNameForAttribution(a, aParticipants, aUserNamesById) ===
					getUserNameForAttribution(b, bParticipants, bUserNamesById))
		);
	},
);
export default _default_1;
