import React, { useEffect } from 'react';
import AvatarsWithPluginState from '../../collab-edit/ui/avatars-with-plugin-state';
import styled from 'styled-components';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorView } from 'prosemirror-view';
import { CollabEditOptions } from '../../collab-edit';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  DispatchAnalyticsEvent,
} from '../../analytics';

const ToolbarButtonWrapper = styled.div<{ takeFullWidth: boolean }>`
  display: flex;
  flex-grow: ${(props) => (props.takeFullWidth ? 1 : 0)};
  justify-content: flex-end;
  align-items: center;
  & > div {
    margin-right: 0;
  }
`;

export const AvatarGroupPluginWrapper = (props: {
  collabEdit?: CollabEditOptions;
  editorView: EditorView;
  eventDispatcher: EventDispatcher<any>;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  takeFullWidth: boolean;
}) => {
  const { dispatchAnalyticsEvent } = props;

  useEffect(() => {
    if (!dispatchAnalyticsEvent) {
      return;
    }

    dispatchAnalyticsEvent({
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.BUTTON,
      actionSubjectId: ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
      eventType: EVENT_TYPE.UI,
    });
  }, [dispatchAnalyticsEvent]);

  return (
    <ToolbarButtonWrapper
      aria-label="Editors"
      data-testid={'avatar-group-in-plugin'}
      takeFullWidth={props.takeFullWidth}
    >
      <AvatarsWithPluginState
        editorView={props.editorView}
        eventDispatcher={props.eventDispatcher}
        inviteToEditComponent={
          props.collabEdit && props.collabEdit.inviteToEditComponent
        }
        inviteToEditHandler={
          props.collabEdit && props.collabEdit.inviteToEditHandler
        }
        isInviteToEditButtonSelected={
          props.collabEdit && props.collabEdit.isInviteToEditButtonSelected
        }
      />
    </ToolbarButtonWrapper>
  );
};
