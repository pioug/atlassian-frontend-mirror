import React from 'react';

import memoizeOne from 'memoize-one';

import type { AvatarProps } from '@atlaskit/avatar-group';
import type { CollabParticipant } from '@atlaskit/editor-common/collab';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { AvatarGroupPlugin } from '../plugin';

import { ColoredAvatarItem } from './colored-avatar-item';

const toAvatar = (
	participant: CollabParticipant,
	api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined,
): AvatarProps => ({
	name: participant.name,
	src: participant.avatar,
	size: 'medium',
	presence: (
		<ColoredAvatarItem api={api} name={participant.name} sessionId={participant.sessionId} />
	),
});

export default memoizeOne(toAvatar, function participantEquals([a], [b]) {
	return a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId;
});
