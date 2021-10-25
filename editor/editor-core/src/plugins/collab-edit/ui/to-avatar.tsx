import React from 'react';
import { AvatarProps } from '@atlaskit/avatar-group';
import memoizeOne from 'memoize-one';
import { CollabParticipant } from '../types';
import { ColoredAvatarItem } from './colored-avatar-item';

const toAvatar = (participant: CollabParticipant): AvatarProps => ({
  name: participant.name,
  src: participant.avatar,
  size: 'medium',
  presence: (
    <ColoredAvatarItem
      name={participant.name}
      sessionId={participant.sessionId}
    />
  ),
});

export default memoizeOne(toAvatar, function participantEquals([a], [b]) {
  return (
    a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId
  );
});
