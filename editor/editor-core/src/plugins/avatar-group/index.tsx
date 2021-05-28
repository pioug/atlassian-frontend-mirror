import React from 'react';
import { EditorPlugin } from '../../types';
import { CollabEditOptions } from '../collab-edit';
import { AvatarGroupPluginWrapper } from './ui/AvatarGroupPluginWrapper';

const avatarGroup = (props: {
  collabEdit?: CollabEditOptions;
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
      />
    );
  },
});

export default avatarGroup;
