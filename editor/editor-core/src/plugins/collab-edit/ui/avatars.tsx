/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AvatarGroup from '@atlaskit/avatar-group';

import { avatarContainer } from './styles';
import type { ReadOnlyParticipants } from '../participants';
import toAvatar from './to-avatar';
import type { CollabParticipant } from '@atlaskit/editor-common/collab';
import { scrollToCollabCursor } from '../utils';
import type { AnalyticsEvent } from '@atlaskit/analytics-next';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export interface AvatarsProps {
  sessionId?: string;
  participants: ReadOnlyParticipants;
  editorView?: EditorView;
  featureFlags: FeatureFlags;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
}

export const Avatars: React.FC<AvatarsProps> = React.memo((props) => {
  const { sessionId, editorView, featureFlags } = props;
  const participants = props.participants.toArray() as CollabParticipant[];
  const avatars = participants
    .sort((p) => (p.sessionId === sessionId ? -1 : 1))
    .map(toAvatar);

  if (!avatars.length) {
    return null;
  }

  return (
    <div css={avatarContainer}>
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

          const allowCollabAvatarScroll = featureFlags?.collabAvatarScroll;

          // user does not need to scroll to their own position (index 0)
          if (allowCollabAvatarScroll && index > 0) {
            scrollToCollabCursor(
              editorView,
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
