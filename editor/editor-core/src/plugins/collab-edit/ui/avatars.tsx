import React from 'react';
import { EditorView } from 'prosemirror-view';
import AvatarGroup from '@atlaskit/avatar-group';

import { AvatarContainer } from './styles';
import { ReadOnlyParticipants } from '../participants';
import toAvatar from './to-avatar';
import { CollabParticipant } from '../types';
import { scrollToCollabCursor } from '../utils';
import { AnalyticsEvent } from '@atlaskit/analytics-next';
import { getFeatureFlags } from '../../feature-flags-context';

export interface AvatarsProps {
  sessionId?: string;
  participants: ReadOnlyParticipants;
  editorView?: EditorView;
}

export const Avatars: React.FC<AvatarsProps> = React.memo((props) => {
  const { sessionId, editorView } = props;
  const participants = props.participants.toArray() as CollabParticipant[];
  const avatars = participants
    .sort((p) => (p.sessionId === sessionId ? -1 : 1))
    .map(toAvatar);

  if (!avatars.length) {
    return null;
  }

  return (
    <AvatarContainer>
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
          if (!editorView) {
            return;
          }

          const featureFlags = getFeatureFlags(editorView.state);
          const allowCollabAvatarScroll = featureFlags?.collabAvatarScroll;

          // user does not need to scroll to their own position (index 0)
          if (allowCollabAvatarScroll && index > 0) {
            scrollToCollabCursor(
              editorView,
              participants,
              props.sessionId,
              index,
            );
          }
        }}
      />
      {props.children}
    </AvatarContainer>
  );
});
