import React from 'react';
import { AvatarPropTypes } from '@atlaskit/avatar';
import memoizeOne, { EqualityFn } from 'memoize-one';
import { CollabParticipant } from '../types';
import { ColoredAvatarItem } from './colored-avatar-item';

const toAvatar = (participant: CollabParticipant): AvatarPropTypes => ({
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

const participantEquals: EqualityFn = ([aRaw], [bRaw]) => {
  const a = aRaw as CollabParticipant;
  const b = bRaw as CollabParticipant;
  return (
    a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId
  );
};

export default memoizeOne(toAvatar, participantEquals);
