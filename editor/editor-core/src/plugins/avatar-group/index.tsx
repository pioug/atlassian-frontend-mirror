import React from 'react';
import { EditorPlugin } from '../../types';
import { CollabEditOptions } from '../collab-edit';
import AvatarGroupPluginWrapper from './ui/AvatarGroupPluginWrapper';

const avatarGroup = (props: {
  collabEdit?: CollabEditOptions;
  takeFullWidth: boolean;
}): EditorPlugin => ({
  name: 'avatarGroup',

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    disabled,
    isToolbarReducedSpacing,
    eventDispatcher,
    dispatchAnalyticsEvent,
  }) {
    return (
      <AvatarGroupPluginWrapper
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        collabEdit={props.collabEdit}
        takeFullWidth={props.takeFullWidth}
      />
    );
  },
});

export default avatarGroup;
