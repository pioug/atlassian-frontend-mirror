import React from 'react';

import memoizeOne, { type MemoizedFn } from 'memoize-one';
import type { IntlShape } from 'react-intl-next';

import type { AvatarProps } from '@atlaskit/avatar-group';
import type { CollabParticipant } from '@atlaskit/editor-common/collab';
import { avatarGroupMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';

import { ColoredAvatarItem } from './colored-avatar-item';

const toAvatar = (
	participant: CollabParticipant,
	api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined,
	formatMessage: IntlShape['formatMessage'],
): AvatarProps => ({
	name:
		participant.name ||
		(fg('platform_ally_avatar_button_fix')
			? formatMessage(avatarGroupMessages.anonymousCollaborator)
			: ''),
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
	) => AvatarProps
> = memoizeOne(toAvatar, function participantEquals([a], [b]) {
	return a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId;
});
export default _default_1;
