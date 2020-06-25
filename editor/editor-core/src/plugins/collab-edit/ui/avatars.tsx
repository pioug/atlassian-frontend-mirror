import React from 'react';
import AvatarGroup from '@atlaskit/avatar-group';

import { AvatarContainer } from './styles';
import { ReadOnlyParticipants } from '../participants';
import toAvatar from './to-avatar';
import { CollabParticipant } from '../types';

export interface AvatarsProps {
  sessionId?: string;
  participants: ReadOnlyParticipants;
}

export const Avatars: React.StatelessComponent<AvatarsProps> = React.memo(
  props => {
    const { sessionId } = props;
    const participants = props.participants.toArray() as CollabParticipant[];
    const avatars = participants
      .sort(p => (p.sessionId === sessionId ? -1 : 1))
      .map(toAvatar);

    if (!avatars.length) {
      return null;
    }

    return (
      <AvatarContainer>
        <AvatarGroup appearance="stack" size="medium" data={avatars} />
        {props.children}
      </AvatarContainer>
    );
  },
);
